import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import joinedload
from sqlmodel import Session

from src.core.settings import settings
from src.database.engine import get_session as get_db
from src.database.models import User, UserSettings
from src.modules.user.user_methods import get_user_by_username

from .serializer import UserResponse

router = APIRouter()
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Get current user from JWT token."""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user_by_username(db, username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@router.get("/account", response_model=UserResponse)
def get_account(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get current user account information."""
    # Load user with user_settings relationship
    user_with_settings = (
        db.query(User)
        .options(joinedload(User.user_settings))
        .filter(User.id == current_user.id)
        .first()
    )

    if not user_with_settings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Create user settings if they don't exist (for existing users)
    if not user_with_settings.user_settings:
        user_settings = UserSettings(user_id=user_with_settings.id, is_onboarded=False)
        db.add(user_settings)
        db.commit()
        db.refresh(user_with_settings)

    return UserResponse.model_validate(user_with_settings)
