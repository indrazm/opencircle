from datetime import datetime, timedelta
from typing import List, Optional

from sqlmodel import Session, select

from src.database.models import Poll, PollOption, PollVote


def create_poll(db: Session, poll_data: dict, options_data: List[dict]) -> Poll:
    """Create a new poll with options."""
    poll = Poll(**poll_data)
    db.add(poll)
    db.commit()
    db.refresh(poll)

    # Create poll options
    for option_data in options_data:
        option_data["poll_id"] = poll.id
        option = PollOption(**option_data)
        db.add(option)

    db.commit()
    db.refresh(poll)
    return poll


def get_poll_by_post_id(db: Session, post_id: str) -> Optional[Poll]:
    """Get poll by post ID with options."""
    statement = select(Poll).where(Poll.post_id == post_id)
    return db.exec(statement).one_or_none()


def get_poll_by_id(db: Session, poll_id: str) -> Optional[Poll]:
    """Get poll by ID with options."""
    statement = select(Poll).where(Poll.id == poll_id)
    return db.exec(statement).one_or_none()


def vote_poll(
    db: Session, poll_id: str, option_id: str, user_id: str
) -> Optional[PollVote]:
    """Vote on a poll option. Returns existing vote if user already voted."""
    # Check if user already voted on this poll
    existing_vote = db.exec(
        select(PollVote).where(PollVote.poll_id == poll_id, PollVote.user_id == user_id)
    ).one_or_none()

    if existing_vote:
        return existing_vote  # User already voted

    # Create new vote
    vote = PollVote(poll_id=poll_id, option_id=option_id, user_id=user_id)
    db.add(vote)

    # Update option vote count
    option = db.get(PollOption, option_id)
    if option:
        option.vote_count += 1

    # Update total vote count
    poll = db.get(Poll, poll_id)
    if poll:
        poll.total_votes += 1

    db.commit()
    return vote


def update_vote(
    db: Session, poll_id: str, old_option_id: str, new_option_id: str, user_id: str
) -> Optional[PollVote]:
    """Change vote from one option to another."""
    # Remove old vote
    old_vote = db.exec(
        select(PollVote).where(
            PollVote.poll_id == poll_id,
            PollVote.option_id == old_option_id,
            PollVote.user_id == user_id,
        )
    ).one_or_none()

    if not old_vote:
        return None

    db.delete(old_vote)

    # Update old option vote count
    old_option = db.get(PollOption, old_option_id)
    if old_option:
        old_option.vote_count -= 1

    # Create new vote
    new_vote = PollVote(poll_id=poll_id, option_id=new_option_id, user_id=user_id)
    db.add(new_vote)

    # Update new option vote count
    new_option = db.get(PollOption, new_option_id)
    if new_option:
        new_option.vote_count += 1

    db.commit()
    return new_vote


def check_poll_expired(db: Session, poll: Poll) -> bool:
    """Check if poll has expired based on duration_hours and creation time."""
    if not poll.is_active:
        return True

    # Get the associated post to check creation time
    from src.modules.post.post_methods import get_post

    post = get_post(db, poll.post_id)

    if not post:
        return True

    end_time = post.created_at + timedelta(hours=poll.duration_hours)
    return datetime.now() > end_time


def deactivate_expired_polls(db: Session) -> None:
    """Deactivate all polls that have expired."""
    # This would need to be implemented with a query to find expired polls
    # and update their is_active status
    pass


def get_user_vote(db: Session, poll_id: str, user_id: str) -> Optional[PollVote]:
    """Get user's current vote for a poll."""
    return db.exec(
        select(PollVote).where(PollVote.poll_id == poll_id, PollVote.user_id == user_id)
    ).one_or_none()


def get_poll_results(db: Session, poll_id: str) -> Optional[dict]:
    """Get poll results with vote counts and percentages."""
    poll = get_poll_by_id(db, poll_id)
    if not poll:
        return None

    results: dict = {
        "poll_id": poll.id,
        "total_votes": poll.total_votes,
        "is_active": poll.is_active,
        "options": [],  # type: list[dict]
    }

    for option in poll.options:
        percentage = (
            (option.vote_count / poll.total_votes * 100) if poll.total_votes > 0 else 0
        )
        results["options"].append(
            {
                "id": option.id,
                "text": option.text,
                "vote_count": option.vote_count,
                "percentage": round(percentage, 2),
            }
        )

    return results
