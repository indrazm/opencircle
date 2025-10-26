from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from src.database.engine import get_session as get_db
from src.database.models import InviteCodeStatus
from src.modules.invite_code.invite_code_methods import (
    auto_join_user_to_channel,
    create_invite_code,
    deactivate_invite_code,
    delete_invite_code,
    get_all_invite_codes,
    get_invite_code,
    get_invite_code_usage_stats,
    get_invite_codes_by_channel,
    update_invite_code,
    validate_and_use_invite_code,
)

from .serializer import (
    InviteCodeCreate,
    InviteCodeResponse,
    InviteCodeUpdate,
    InviteCodeUsageStats,
    InviteCodeValidateRequest,
    InviteCodeValidateResponse,
)

router = APIRouter()


@router.post("/invite-codes/", response_model=InviteCodeResponse)
def create_invite_code_endpoint(
    invite_code: InviteCodeCreate, db: Session = Depends(get_db)
):
    """Create a new invite code."""
    try:
        created_code = create_invite_code(
            db=db,
            code=invite_code.code,
            max_uses=invite_code.max_uses,
            expires_at=invite_code.expires_at,
            auto_join_channel_id=invite_code.auto_join_channel_id,
            created_by=invite_code.created_by,
        )
        return created_code
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/invite-codes/{invite_code_id}", response_model=InviteCodeResponse)
def get_invite_code_endpoint(invite_code_id: str, db: Session = Depends(get_db)):
    """Get an invite code by ID."""
    invite_code = get_invite_code(db, invite_code_id)
    if not invite_code:
        raise HTTPException(status_code=404, detail="Invite code not found")
    return invite_code


@router.get("/invite-codes/", response_model=List[InviteCodeResponse])
def get_all_invite_codes_endpoint(
    skip: int = 0,
    limit: int = 100,
    status: Optional[InviteCodeStatus] = None,
    created_by: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get all invite codes with optional filtering."""
    return get_all_invite_codes(db, skip, limit, status, created_by)


@router.get(
    "/invite-codes/channel/{channel_id}", response_model=List[InviteCodeResponse]
)
def get_invite_codes_by_channel_endpoint(
    channel_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Get all invite codes for a specific channel."""
    return get_invite_codes_by_channel(db, channel_id, skip, limit)


@router.put("/invite-codes/{invite_code_id}", response_model=InviteCodeResponse)
def update_invite_code_endpoint(
    invite_code_id: str,
    invite_code: InviteCodeUpdate,
    db: Session = Depends(get_db),
):
    """Update an invite code."""
    update_data = {k: v for k, v in invite_code.model_dump().items() if v is not None}
    updated_code = update_invite_code(db, invite_code_id, update_data)
    if not updated_code:
        raise HTTPException(status_code=404, detail="Invite code not found")
    return updated_code


@router.post(
    "/invite-codes/{invite_code_id}/deactivate", response_model=InviteCodeResponse
)
def deactivate_invite_code_endpoint(invite_code_id: str, db: Session = Depends(get_db)):
    """Deactivate an invite code (mark as expired)."""
    deactivated_code = deactivate_invite_code(db, invite_code_id)
    if not deactivated_code:
        raise HTTPException(status_code=404, detail="Invite code not found")
    return deactivated_code


@router.delete("/invite-codes/{invite_code_id}")
def delete_invite_code_endpoint(invite_code_id: str, db: Session = Depends(get_db)):
    """Delete an invite code."""
    if not delete_invite_code(db, invite_code_id):
        raise HTTPException(status_code=404, detail="Invite code not found")
    return {"message": "Invite code deleted"}


@router.post("/invite-codes/validate", response_model=InviteCodeValidateResponse)
def validate_invite_code_endpoint(
    request: InviteCodeValidateRequest, db: Session = Depends(get_db)
):
    """Validate and use an invite code."""
    invite_code, error_message = validate_and_use_invite_code(
        db, request.code, request.user_id
    )

    if error_message:
        return InviteCodeValidateResponse(
            valid=False,
            message=error_message,
            auto_joined_channel=False,
        )

    auto_joined_channel = False
    channel_id = None
    if invite_code and invite_code.auto_join_channel_id:
        auto_join_user_to_channel(db, request.user_id, invite_code.auto_join_channel_id)
        auto_joined_channel = True
        channel_id = invite_code.auto_join_channel_id

    return InviteCodeValidateResponse(
        valid=True,
        invite_code=InviteCodeResponse.model_validate(invite_code),
        message="Invite code used successfully",
        auto_joined_channel=auto_joined_channel,
        channel_id=channel_id,
    )


@router.get("/invite-codes/{invite_code_id}/stats", response_model=InviteCodeUsageStats)
def get_invite_code_stats_endpoint(invite_code_id: str, db: Session = Depends(get_db)):
    """Get usage statistics for an invite code."""
    stats = get_invite_code_usage_stats(db, invite_code_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Invite code not found")
    return InviteCodeUsageStats(**stats)
