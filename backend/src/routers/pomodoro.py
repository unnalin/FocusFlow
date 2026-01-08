"""Pomodoro router."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
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
def create_session(
    session: PomodoroSessionCreate,
    db: Session = Depends(get_db)
):
    """Create a new pomodoro session."""
    return pomodoro_service.create_session(db, session)


@router.get("/sessions/{session_id}", response_model=PomodoroSessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db)):
    """Get a pomodoro session by ID."""
    session = pomodoro_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.get("/active", response_model=PomodoroSessionResponse | None)
def get_active_session(db: Session = Depends(get_db)):
    """Get the currently active pomodoro session."""
    return pomodoro_service.get_active_session(db)


@router.put("/sessions/{session_id}", response_model=PomodoroSessionResponse)
def update_session(
    session_id: int,
    session_update: PomodoroSessionUpdate,
    db: Session = Depends(get_db)
):
    """Update a pomodoro session."""
    session = pomodoro_service.update_session(db, session_id, session_update)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.get("/stats/today", response_model=PomodoroStatsResponse)
def get_stats_today(db: Session = Depends(get_db)):
    """Get pomodoro statistics for today."""
    return pomodoro_service.get_stats_today(db)
