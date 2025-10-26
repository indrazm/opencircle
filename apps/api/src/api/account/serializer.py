from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from src.database.models import Role


class UserSettingsResponse(BaseModel):
    is_onboarded: bool

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: str
    name: Optional[str] = None
    bio: Optional[str] = None
    username: str
    email: str
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    role: Role
    created_at: datetime
    updated_at: datetime
    user_settings: Optional[UserSettingsResponse] = None

    class Config:
        from_attributes = True
