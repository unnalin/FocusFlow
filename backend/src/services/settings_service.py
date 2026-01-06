"""Settings service for managing user preferences."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.models.settings import UserSettings
from src.schemas.settings import SettingsUpdate


async def get_settings(db: AsyncSession) -> UserSettings:
    """Get user settings (singleton pattern - ID always 1)."""
    result = await db.execute(select(UserSettings).where(UserSettings.id == 1))
    settings = result.scalar_one_or_none()

    if not settings:
        # Create default settings if none exist
        settings = UserSettings(id=1)
        db.add(settings)
        await db.commit()
        await db.refresh(settings)

    return settings


async def update_settings(db: AsyncSession, settings_update: SettingsUpdate) -> UserSettings:
    """Update user settings."""
    settings = await get_settings(db)

    # Update fields
    for field, value in settings_update.model_dump().items():
        setattr(settings, field, value)

    await db.commit()
    await db.refresh(settings)
    return settings
