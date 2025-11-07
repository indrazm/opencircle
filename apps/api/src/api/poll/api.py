from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlmodel import Session, select

from src.api.account.api import get_current_user
from src.api.poll.serializer import (
    PollCreate,
    PollResponse,
    PollResultsResponse,
    PollVoteCreate,
    PollVoteResponse,
)
from src.database.engine import get_session
from src.database.models import Poll, PollOption, User
from src.modules.poll.poll_methods import (
    create_poll,
    get_poll_by_id,
    get_poll_by_post_id,
    get_poll_results,
    get_user_vote,
    update_vote,
    vote_poll,
)

router = APIRouter()
security = HTTPBearer()


@router.post("/polls", response_model=PollResponse)
def create_new_poll(
    poll_data: PollCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
) -> Poll:
    """Create a new poll."""
    # Verify post exists and user owns it
    from src.modules.post.post_methods import get_post

    post = get_post(db, poll_data.post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to create poll for this post"
        )

    # Validate options (Twitter allows max 4 options)
    if not poll_data.options or len(poll_data.options) < 2:
        raise HTTPException(status_code=400, detail="Poll must have at least 2 options")
    if len(poll_data.options) > 4:
        raise HTTPException(
            status_code=400, detail="Poll cannot have more than 4 options"
        )

    # Create poll with options
    options_data = [{"text": opt.text, "order": opt.order} for opt in poll_data.options]
    poll = create_poll(db, poll_data.model_dump(exclude={"options"}), options_data)

    return PollResponse.model_validate(poll)


@router.get("/polls/{poll_id}", response_model=PollResponse)
def get_poll(
    poll_id: str,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_session),
) -> PollResponse:
    """Get poll details with options and user's vote if authenticated."""
    poll = get_poll_by_id(db, poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    # Build poll response with user vote if authenticated
    poll_data = {
        "id": poll.id,
        "post_id": poll.post_id,
        "duration_hours": poll.duration_hours,
        "is_active": poll.is_active,
        "total_votes": poll.total_votes,
        "created_at": poll.created_at,
        "updated_at": poll.updated_at,
        "options": poll.options,
        "user_vote": get_user_vote(db, poll_id, current_user.id)
        if current_user
        else None,
    }
    return PollResponse.model_validate(poll_data)


@router.get("/posts/{post_id}/poll", response_model=PollResponse)
def get_poll_by_post(
    post_id: str,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_session),
) -> PollResponse:
    """Get poll for a specific post."""
    poll = get_poll_by_post_id(db, post_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found for this post")

    # Build poll response with user vote if authenticated
    poll_data = {
        "id": poll.id,
        "post_id": poll.post_id,
        "duration_hours": poll.duration_hours,
        "is_active": poll.is_active,
        "total_votes": poll.total_votes,
        "created_at": poll.created_at,
        "updated_at": poll.updated_at,
        "options": poll.options,
        "user_vote": get_user_vote(db, poll.id, current_user.id)
        if current_user
        else None,
    }
    return PollResponse.model_validate(poll_data)


@router.post("/polls/{poll_id}/vote", response_model=PollVoteResponse)
def vote_on_poll(
    poll_id: str,
    vote_data: PollVoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
) -> PollVoteResponse:
    """Vote on a poll option."""
    # Verify poll exists and is active
    poll = db.get(Poll, poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    if not poll.is_active:
        raise HTTPException(status_code=400, detail="Poll is no longer active")

    # Verify poll hasn't expired
    from src.modules.post.post_methods import get_post

    post = get_post(db, poll.post_id)
    if post:
        from datetime import datetime, timedelta

        if datetime.now() > post.created_at + timedelta(hours=poll.duration_hours):
            poll.is_active = False
            db.commit()
            raise HTTPException(status_code=400, detail="Poll has expired")

    # Check if user is trying to vote on the wrong poll
    if vote_data.poll_id != poll_id:
        raise HTTPException(status_code=400, detail="Poll ID mismatch")

    # Verify option belongs to this poll
    option = db.exec(
        select(PollOption).where(
            PollOption.id == vote_data.option_id, PollOption.poll_id == poll_id
        )
    ).one_or_none()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found for this poll")

    # Cast vote
    vote = vote_poll(db, poll_id, vote_data.option_id, current_user.id)
    if vote is None:
        raise HTTPException(status_code=400, detail="User has already voted")

    return PollVoteResponse.model_validate(vote)


@router.put("/polls/{poll_id}/vote", response_model=PollVoteResponse)
def change_poll_vote(
    poll_id: str,
    vote_data: PollVoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
) -> PollVoteResponse:
    """Change vote from one option to another."""
    # Verify poll exists and is active
    poll = db.get(Poll, poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    if not poll.is_active:
        raise HTTPException(status_code=400, detail="Poll is no longer active")

    # Get user's current vote
    current_vote = get_user_vote(db, poll_id, current_user.id)
    if not current_vote:
        raise HTTPException(status_code=400, detail="User has not voted yet")

    # Update vote
    updated_vote = update_vote(
        db, poll_id, current_vote.option_id, vote_data.option_id, current_user.id
    )
    if not updated_vote:
        raise HTTPException(status_code=400, detail="Failed to update vote")

    return PollVoteResponse.model_validate(updated_vote)


@router.get("/polls/{poll_id}/results", response_model=PollResultsResponse)
def get_poll_results_endpoint(
    poll_id: str,
    db: Session = Depends(get_session),
) -> PollResultsResponse:
    """Get poll results with vote counts and percentages."""
    results = get_poll_results(db, poll_id)
    if not results:
        raise HTTPException(status_code=404, detail="Poll not found")

    return PollResultsResponse(**results)


@router.delete("/polls/{poll_id}")
def delete_poll(
    poll_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
) -> dict:
    """Delete a poll (only poll creator can delete)."""
    poll = get_poll_by_id(db, poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    # Verify post owner
    from src.modules.post.post_methods import get_post

    post = get_post(db, poll.post_id)
    if not post or post.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this poll"
        )

    # Delete poll and related data (cascade handles options and votes)
    db.delete(poll)
    db.commit()

    return {"message": "Poll deleted successfully"}
