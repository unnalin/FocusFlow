"""Pomodoro router."""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src.schemas.pomodoro import (
    PomodoroSessionCreate,
    PomodoroSessionUpdate,
    PomodoroSessionResponse,
    PomodoroStatsResponse
)
from src.services import pomodoro_service

router = APIRouter(prefix="/pomodoro", tags=["pomodoro"])


@router.post("/sessions", response_model=PomodoroSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session: PomodoroSessionCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new pomodoro session."""
    return await pomodoro_service.create_session(db, session)


@router.get("/sessions/{session_id}", response_model=PomodoroSessionResponse)
async def get_session(session_id: int, db: AsyncSession = Depends(get_db)):
    """Get a pomodoro session by ID."""
    session = await pomodoro_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.get("/active", response_model=Optional[PomodoroSessionResponse])
async def get_active_session(db: AsyncSession = Depends(get_db)):
    """Get the currently active pomodoro session."""
    return await pomodoro_service.get_active_session(db)


@router.put("/sessions/{session_id}", response_model=PomodoroSessionResponse)
async def update_session(
    session_id: int,
    session_update: PomodoroSessionUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a pomodoro session."""
    session = await pomodoro_service.update_session(db, session_id, session_update)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.get("/stats/today", response_model=PomodoroStatsResponse)
async def get_stats_today(db: AsyncSession = Depends(get_db)):
    """Get pomodoro statistics for today."""
    return await pomodoro_service.get_stats_today(db)
