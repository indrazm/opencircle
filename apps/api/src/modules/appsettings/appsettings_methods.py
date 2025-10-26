from typing import Optional

from sqlmodel import Session, select

from src.database.models import AppSettings


def get_or_create_app_settings(db: Session, app_settings_data: dict) -> AppSettings:
    """Get existing app settings or create if none exists. Ensures only one settings record."""
    existing_settings = get_active_app_settings(db)
    if existing_settings:
        return existing_settings

    # Create new settings with singleton ID - this will be the only one
    app_settings = AppSettings(id="singleton", **app_settings_data)
    db.add(app_settings)
    db.commit()
    db.refresh(app_settings)
    return app_settings


def get_active_app_settings(db: Session) -> Optional[AppSettings]:
    """Get the app settings. There should only ever be one settings record."""
    return db.get(AppSettings, "singleton")


def update_app_settings(db: Session, update_data: dict) -> Optional[AppSettings]:
    """Update the app settings. There should only ever be one settings record."""
    app_settings = get_active_app_settings(db)
    if not app_settings:
        return None

    for key, value in update_data.items():
        setattr(app_settings, key, value)
    db.commit()
    db.refresh(app_settings)
    return app_settings


def get_app_settings_count(db: Session) -> int:
    """Get count of app settings records (should be 0 or 1). For validation/debugging."""
    statement = select(AppSettings)
    return len(db.exec(statement).all())
