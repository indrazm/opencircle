from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from src.api.user.serializer import UserResponse


class PollOptionCreate(BaseModel):
    text: str
    order: int = 0


class PollCreate(BaseModel):
    post_id: str
    duration_hours: int = 24
    options: List[PollOptionCreate]


class PollVoteCreate(BaseModel):
    poll_id: str
    option_id: str


class PollVoteUpdate(BaseModel):
    new_option_id: str


class PollOptionResponse(BaseModel):
    id: str
    poll_id: str
    text: str
    order: int
    vote_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PollVoteResponse(BaseModel):
    id: str
    poll_id: str
    option_id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


class PollResponse(BaseModel):
    id: str
    post_id: str
    duration_hours: int
    is_active: bool
    total_votes: int
    created_at: datetime
    updated_at: datetime
    options: List[PollOptionResponse] = []
    user_vote: Optional[PollVoteResponse] = None

    class Config:
        from_attributes = True


class PollResultsResponse(BaseModel):
    poll_id: str
    total_votes: int
    is_active: bool
    options: List[dict]


# Response for when creating a post with poll
class PostWithPollResponse(BaseModel):
    post_id: str
    poll: PollResponse
