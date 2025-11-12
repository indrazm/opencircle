import secrets
import string
from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlmodel import Session, select

from src.database.models import PasswordReset, PasswordResetStatus
from src.modules.user.user_methods import get_user_by_email


def generate_reset_code() -> str:
    """Generate a 6-letter uppercase reset code."""
    return "".join(secrets.choice(string.ascii_uppercase) for _ in range(6))


def create_password_reset(db: Session, email: str) -> Optional[PasswordReset]:
    """Create a new password reset record for the user."""
    user = get_user_by_email(db, email)
    if not user:
        return None

    # Deactivate any existing reset codes for this email
    existing_resets = db.exec(
        select(PasswordReset)
        .where(PasswordReset.email == email)
        .where(PasswordReset.status == PasswordResetStatus.ACTIVE)
    ).all()

    for reset in existing_resets:
        reset.status = PasswordResetStatus.EXPIRED

    # Generate new reset code
    code = generate_reset_code()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)  # 1 hour expiration

    password_reset = PasswordReset(
        code=code,
        email=email,
        user_id=user.id,
        expires_at=expires_at.isoformat(),
        status=PasswordResetStatus.ACTIVE,
    )

    db.add(password_reset)
    db.commit()
    db.refresh(password_reset)

    return password_reset


def get_password_reset_by_code(db: Session, code: str) -> Optional[PasswordReset]:
    """Get a password reset record by code."""
    statement = select(PasswordReset).where(PasswordReset.code == code)
    return db.exec(statement).first()


def is_reset_code_valid(db: Session, code: str) -> bool:
    """Check if a reset code is valid (active and not expired)."""
    reset = get_password_reset_by_code(db, code)
    if not reset:
        return False

    if reset.status != PasswordResetStatus.ACTIVE:
        return False

    # Check expiration
    try:
        expires_at = datetime.fromisoformat(reset.expires_at.replace("Z", "+00:00"))
        if datetime.now(timezone.utc) > expires_at:
            # Mark as expired
            reset.status = PasswordResetStatus.EXPIRED
            db.commit()
            return False
    except ValueError:
        return False

    return True


def use_reset_code(db: Session, code: str) -> Optional[PasswordReset]:
    """Mark a reset code as used and return it."""
    reset = get_password_reset_by_code(db, code)
    if not reset or not is_reset_code_valid(db, code):
        return None

    reset.status = PasswordResetStatus.USED
    db.commit()
    return reset


def reset_user_password(db: Session, code: str, new_password: str) -> bool:
    """Reset user password using a valid reset code."""
    reset = use_reset_code(db, code)
    if not reset:
        return False

    # Update user password
    from src.modules.auth.auth_methods import hash_password
    from src.modules.user.user_methods import update_user

    hashed_password = hash_password(new_password)
    updated_user = update_user(db, reset.user_id, {"password": hashed_password})

    return updated_user is not None
