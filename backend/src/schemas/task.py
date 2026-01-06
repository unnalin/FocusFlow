"""Task schemas."""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class TaskBase(BaseModel):
    """Base task schema."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class TaskCreate(TaskBase):
    """Schema for creating a task."""
    pass


class TaskUpdate(BaseModel):
    """Schema for updating a task."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    completed: Optional[bool] = None
    order: Optional[int] = None


class TaskResponse(TaskBase):
    """Schema for task response."""
    id: int
    completed: bool
    order: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
