"""Settings router."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.schemas.settings import SettingsResponse, SettingsUpdate
from src.services import settings_service

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=SettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    """Get user settings."""
    return settings_service.get_settings(db)


@router.put("", response_model=SettingsResponse)
def update_settings(
    settings: SettingsUpdate,
    db: Session = Depends(get_db)
):
    """Update user settings."""
    return settings_service.update_settings(db, settings)
