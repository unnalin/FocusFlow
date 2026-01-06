"""Settings model for user preferences."""
from sqlalchemy import Column, Integer, String, Boolean
from src.database import Base


class UserSettings(Base):
    """User settings for UI preferences."""
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    theme = Column(String, default="dark")  # light or dark
    color_scheme = Column(String, default="default")  # default or forest
    immersive_mode = Column(Boolean, default=True)
    focus_duration = Column(Integer, default=25)  # minutes
    break_duration = Column(Integer, default=5)  # minutes
    long_break_duration = Column(Integer, default=15)  # minutes
    sessions_until_long_break = Column(Integer, default=4)
