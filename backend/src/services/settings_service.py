"""Settings service for managing user preferences."""
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.models.settings import UserSettings
from src.schemas.settings import SettingsUpdate


def get_settings(db: Session) -> UserSettings:
    """Get user settings (singleton pattern - ID always 1)."""
    result = db.execute(select(UserSettings).where(UserSettings.id == 1))
    settings = result.scalar_one_or_none()

    if not settings:
        # Create default settings if none exist
        settings = UserSettings(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings


def update_settings(db: Session, settings_update: SettingsUpdate) -> UserSettings:
    """Update user settings."""
    settings = get_settings(db)

    # Update fields
    for field, value in settings_update.model_dump().items():
        setattr(settings, field, value)

    db.commit()
    db.refresh(settings)
    return settings
