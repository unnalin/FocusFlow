"""Base Pydantic schemas."""
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class BaseSchema(BaseModel):
    """Base schema with common configuration."""
    model_config = ConfigDict(from_attributes=True)


class TimestampSchema(BaseSchema):
    """Schema with timestamp fields."""
    created_at: datetime
    updated_at: Optional[datetime] = None


class ResponseSchema(BaseSchema):
    """Base response schema."""
    id: int
