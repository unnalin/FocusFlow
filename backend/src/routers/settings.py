"""Settings router."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src.schemas.settings import SettingsResponse, SettingsUpdate
from src.services import settings_service

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=SettingsResponse)
async def get_settings(db: AsyncSession = Depends(get_db)):
    """Get user settings."""
    return await settings_service.get_settings(db)


@router.put("", response_model=SettingsResponse)
async def update_settings(
    settings: SettingsUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update user settings."""
    return await settings_service.update_settings(db, settings)
