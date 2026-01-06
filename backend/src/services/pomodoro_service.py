"""Pomodoro service for managing focus sessions."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from src.models.pomodoro import PomodoroSession
from src.schemas.pomodoro import PomodoroSessionCreate, PomodoroSessionUpdate, PomodoroStatsResponse
from datetime import datetime, timedelta
from typing import Optional


async def create_session(db: AsyncSession, session_data: PomodoroSessionCreate) -> PomodoroSession:
    """Create a new pomodoro session."""
    session = PomodoroSession(**session_data.model_dump())
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


async def get_session(db: AsyncSession, session_id: int) -> Optional[PomodoroSession]:
    """Get a session by ID."""
    result = await db.execute(select(PomodoroSession).where(PomodoroSession.id == session_id))
    return result.scalar_one_or_none()


async def get_active_session(db: AsyncSession) -> Optional[PomodoroSession]:
    """Get the currently active session."""
    result = await db.execute(
        select(PomodoroSession)
        .where(PomodoroSession.state == "active")
        .order_by(PomodoroSession.created_at.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()


async def update_session(
    db: AsyncSession,
    session_id: int,
    session_update: PomodoroSessionUpdate
) -> Optional[PomodoroSession]:
    """Update a pomodoro session."""
    session = await get_session(db, session_id)
    if not session:
        return None

    update_data = session_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)

    await db.commit()
    await db.refresh(session)
    return session


async def get_stats_today(db: AsyncSession) -> PomodoroStatsResponse:
    """Get pomodoro statistics for today."""
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    # Count completed focus sessions today
    result = await db.execute(
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
    result = await db.execute(
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
