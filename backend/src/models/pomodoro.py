"""Pomodoro session model for tracking focus sessions."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func, BigInteger
from src.database import Base


class PomodoroSession(Base):
    """Pomodoro session model."""
    __tablename__ = "pomodoro_sessions"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True)
    session_type = Column(String(20), nullable=False)  # 'focus' or 'break'
    duration = Column(Integer, nullable=False)  # Duration in minutes
    state = Column(String(20), default="pending", nullable=False)  # pending, active, completed, cancelled
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    paused_duration_ms = Column(BigInteger, default=0, nullable=False)  # Total paused time in milliseconds
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
