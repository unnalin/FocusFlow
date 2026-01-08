"""Pomodoro service for managing focus sessions."""
from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_
from src.models.pomodoro import PomodoroSession
from src.schemas.pomodoro import PomodoroSessionCreate, PomodoroSessionUpdate, PomodoroStatsResponse
from datetime import datetime, timedelta
from typing import Optional


def create_session(db: Session, session_data: PomodoroSessionCreate) -> PomodoroSession:
    """Create a new pomodoro session."""
    session = PomodoroSession(**session_data.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_session(db: Session, session_id: int) -> Optional[PomodoroSession]:
    """Get a session by ID."""
    result = db.execute(select(PomodoroSession).where(PomodoroSession.id == session_id))
    return result.scalar_one_or_none()


def get_active_session(db: Session) -> Optional[PomodoroSession]:
    """Get the currently active session."""
    result = db.execute(
        select(PomodoroSession)
        .where(PomodoroSession.state == "active")
        .order_by(PomodoroSession.created_at.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()


def update_session(
    db: Session,
    session_id: int,
    session_update: PomodoroSessionUpdate
) -> Optional[PomodoroSession]:
    """Update a pomodoro session."""
    session = get_session(db, session_id)
    if not session:
        return None

    update_data = session_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)

    db.commit()
    db.refresh(session)
    return session


def get_stats_today(db: Session) -> PomodoroStatsResponse:
    """Get pomodoro statistics for today."""
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    # Count completed focus sessions today
    result = db.execute(
        select(func.count(PomodoroSession.id))
        .where(
            and_(
                PomodoroSession.session_type == "focus",
                PomodoroSession.state == "completed",
                PomodoroSession.completed_at >= today_start
            )
        )
    )
    completed_today = result.scalar() or 0

    # Calculate total focus time
    result = db.execute(
        select(func.sum(PomodoroSession.duration))
        .where(
            and_(
                PomodoroSession.session_type == "focus",
                PomodoroSession.state == "completed",
                PomodoroSession.completed_at >= today_start
            )
        )
    )
    total_focus_time = result.scalar() or 0

    return PomodoroStatsResponse(
        completed_today=completed_today,
        total_focus_time_minutes=total_focus_time
    )
