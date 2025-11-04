from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from src.api.channels.serializer import ChannelResponse
from src.api.user.serializer import UserResponse


class ResourceCreate(BaseModel):
    url: str
    description: Optional[str] = None
    user_id: str
    channel_id: str


class ResourceUpdate(BaseModel):
    url: Optional[str] = None
    description: Optional[str] = None


class ResourceResponse(BaseModel):
    id: str
    url: str
    description: Optional[str] = None
    user_id: str
    channel_id: str
    user: UserResponse
    channel: ChannelResponse
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
