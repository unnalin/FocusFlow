"""Pomodoro session schemas."""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class PomodoroSessionBase(BaseModel):
    """Base pomodoro session schema."""
    session_type: str = Field(..., pattern="^(focus|break)$")
    duration: int = Field(..., ge=1, le=60)


class PomodoroSessionCreate(PomodoroSessionBase):
    """Schema for creating a pomodoro session."""
    task_id: Optional[int] = None


class PomodoroSessionUpdate(BaseModel):
    """Schema for updating a pomodoro session."""
    state: Optional[str] = Field(None, pattern="^(pending|active|completed|cancelled)$")
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    paused_duration_ms: Optional[int] = None


class PomodoroSessionResponse(PomodoroSessionBase):
    """Schema for pomodoro session response."""
    id: int
    task_id: Optional[int] = None
    state: str
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    paused_duration_ms: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PomodoroStatsResponse(BaseModel):
    """Schema for pomodoro statistics."""
    completed_today: int
    total_focus_time_minutes: int
