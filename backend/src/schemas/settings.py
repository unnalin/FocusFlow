"""Settings schemas."""
from pydantic import BaseModel, Field


class SettingsBase(BaseModel):
    """Base settings schema."""
    theme: str = Field(default="dark", pattern="^(light|dark)$")
    color_scheme: str = Field(default="default", pattern="^(default|forest)$")
    immersive_mode: bool = Field(default=True)
    focus_duration: int = Field(default=25, ge=1, le=60)
    break_duration: int = Field(default=5, ge=1, le=30)
    long_break_duration: int = Field(default=15, ge=1, le=60)
    sessions_until_long_break: int = Field(default=4, ge=1, le=10)


class SettingsUpdate(SettingsBase):
    """Schema for updating settings."""
    pass


class SettingsResponse(SettingsBase):
    """Schema for settings response."""
    id: int

    class Config:
        from_attributes = True
