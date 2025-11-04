from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session

from src.api.account.api import get_current_user
from src.database.engine import get_session as get_db
from src.database.models import User
from src.modules.channels.channels_methods import is_member
from src.modules.resources.resources_methods import (
    create_resource,
    delete_resource,
    filter_private_channel_resources,
    get_all_resources,
    get_resource,
    get_resources_by_user,
    update_resource,
)

from .serializer import ResourceCreate, ResourceResponse, ResourceUpdate

router = APIRouter()
security = HTTPBearer(auto_error=False)


def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Get current user from JWT token if provided, otherwise return None."""
    if not credentials:
        return None

    try:
        import jwt

        from src.core.settings import settings
        from src.modules.user.user_methods import get_user_by_username

        payload = jwt.decode(
            credentials.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        username: str = payload.get("sub")
        if username is None:
            return None

        user = get_user_by_username(db, username)
        return user
    except Exception:
        return None


@router.post("/resources/", response_model=ResourceResponse)
def create_resource_endpoint(
    resource: ResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify channel exists and user has access
    from src.modules.channels.channels_methods import get_channel

    channel = get_channel(db, resource.channel_id)
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")

    if channel.type == "private":
        if not is_member(db, channel.id, current_user.id):
            raise HTTPException(
                status_code=403, detail="Access denied to private channel"
            )

    # Verify the user_id matches the current user
    if resource.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Can only create resources for yourself"
        )

    resource_data = resource.model_dump()
    created_resource = create_resource(db, resource_data)
    return created_resource


@router.get("/resources/{resource_id}", response_model=ResourceResponse)
def get_resource_endpoint(
    resource_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    resource = get_resource(db, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    # Check if user has access to the resource's channel
    if resource.channel.type == "private":
        from src.modules.channels.channels_methods import is_member

        if not current_user or not is_member(db, resource.channel_id, current_user.id):
            raise HTTPException(
                status_code=403, detail="Access denied to private channel"
            )

    return resource


@router.get("/resources/", response_model=List[ResourceResponse])
def get_all_resources_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    all_resources = get_all_resources(db, skip, limit)
    return filter_private_channel_resources(
        all_resources, current_user_id=current_user.id if current_user else None, db=db
    )


@router.get("/users/{user_id}/resources/", response_model=List[ResourceResponse])
def get_resources_by_user_endpoint(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    resources = get_resources_by_user(db, user_id)
    return filter_private_channel_resources(
        resources, current_user_id=current_user.id if current_user else None, db=db
    )


@router.put("/resources/{resource_id}", response_model=ResourceResponse)
def update_resource_endpoint(
    resource_id: str,
    resource: ResourceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_resource = get_resource(db, resource_id)
    if not existing_resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    # Check if user owns the resource
    if existing_resource.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Can only update your own resources"
        )

    update_data = {k: v for k, v in resource.model_dump().items() if v is not None}
    updated_resource = update_resource(db, resource_id, update_data)
    if not updated_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return updated_resource


@router.delete("/resources/{resource_id}")
def delete_resource_endpoint(
    resource_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_resource = get_resource(db, resource_id)
    if not existing_resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    # Check if user owns the resource
    if existing_resource.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Can only delete your own resources"
        )

    if not delete_resource(db, resource_id):
        raise HTTPException(status_code=404, detail="Resource not found")
    return {"message": "Resource deleted"}
