# Data Model: FocusFlow

**Feature**: FocusFlow - ADHD-Friendly Focus Tool
**Date**: 2026-01-06
**Status**: Phase 1 Complete

This document defines the database schema, entity relationships, and validation rules for FocusFlow.

---

## Database Technology

**Engine**: SQLite 3.x
**ORM**: SQLAlchemy 2.0+ (Async)
**Migrations**: Alembic
**Configuration**: WAL (Write-Ahead Logging) mode for concurrent access

---

## Entity Relationship Diagram

```
┌─────────────────┐
│  UserSettings   │
│  (singleton)    │
└─────────────────┘

┌─────────────────┐         ┌──────────────────┐
│      Task       │────1:N──│    MicroStep     │
│                 │         │                  │
└─────────────────┘         └──────────────────┘
        │
        │ 0:N
        ▼
┌─────────────────┐
│ PomodoroSession │
└─────────────────┘

┌─────────────────┐
│ BrainDumpEntry  │
│  (independent)  │
└─────────────────┘

┌─────────────────┐         ┌──────────────────┐
│     Habit       │────1:N──│  HabitCheckIn    │
│                 │         │                  │
└─────────────────┘         └──────────────────┘
```

---

## Schema Definitions

### 1. Task

Represents a work item that user wants to accomplish. Can be broken down into micro-steps.

**Table**: `tasks`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String (UUID) | PRIMARY KEY | Unique identifier |
| `title` | String(500) | NOT NULL | Task title/description |
| `description` | Text | NULL | Optional detailed description |
| `completed` | Boolean | DEFAULT FALSE | Completion status |
| `order` | Integer | DEFAULT 0 | Display order for sorting |
| `created_at` | DateTime (UTC) | NOT NULL, DEFAULT NOW | Creation timestamp |
| `updated_at` | DateTime (UTC) | NOT NULL, DEFAULT NOW | Last update timestamp |

**Indexes**:
- `idx_tasks_completed` on (`completed`)
- `idx_tasks_order` on (`order`)
- `idx_tasks_created_at` on (`created_at DESC`)

**SQLAlchemy Model**:

```python
# backend/src/models/task.py
from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from ..database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    completed = Column(Boolean, default=False, index=True)
    order = Column(Integer, default=0, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    micro_steps = relationship("MicroStep", back_populates="task", cascade="all, delete-orphan")
    pomodoro_sessions = relationship("PomodoroSession", back_populates="task")
```

**Pydantic Schema**:

```python
# backend/src/schemas/task.py
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, List

class MicroStepBase(BaseModel):
    title: str = Field(..., max_length=500, description="Micro-step title")

class MicroStepCreate(MicroStepBase):
    pass

class MicroStepResponse(MicroStepBase):
    id: str
    completed: bool
    order: int

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500, description="Task title")
    description: Optional[str] = Field(None, description="Optional detailed description")

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    completed: Optional[bool] = None
    order: Optional[int] = None

class TaskResponse(TaskBase):
    id: str
    completed: bool
    order: int
    created_at: datetime
    updated_at: datetime
    micro_steps: List[MicroStepResponse] = []

    class Config:
        from_attributes = True
```

**Validation Rules**:
- `title` must be 1-500 characters
- `order` must be >= 0
- Cannot mark task as complete if micro-steps exist and are incomplete (enforced in service layer)

---

### 2. MicroStep

Represents a small, actionable sub-task within a parent Task.

**Table**: `micro_steps`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String (UUID) | PRIMARY KEY | Unique identifier |
| `task_id` | String (UUID) | FOREIGN KEY (tasks.id) ON DELETE CASCADE | Parent task reference |
| `title` | String(500) | NOT NULL | Micro-step description |
| `completed` | Boolean | DEFAULT FALSE | Completion status |
| `order` | Integer | DEFAULT 0 | Display order within task |
| `created_at` | DateTime (UTC) | DEFAULT NOW | Creation timestamp |

**Indexes**:
- `idx_microsteps_task_id` on (`task_id`)
- `idx_microsteps_order` on (`task_id`, `order`)

**SQLAlchemy Model**:

```python
# backend/src/models/task.py (continued)
class MicroStep(Base):
    __tablename__ = "micro_steps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    completed = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    task = relationship("Task", back_populates="micro_steps")
```

**Validation Rules**:
- `title` must be 1-500 characters
- `order` must be >= 0
- `task_id` must reference existing task

---

### 3. PomodoroSession

Represents a focus or break period associated with a task.

**Table**: `pomodoro_sessions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String (UUID) | PRIMARY KEY | Unique identifier |
| `task_id` | String (UUID) | FOREIGN KEY (tasks.id) ON DELETE SET NULL | Associated task (optional) |
| `session_type` | Enum('focus', 'break') | NOT NULL | Type of session |
| `duration_minutes` | Integer | NOT NULL | Planned duration (25 or 5) |
| `state` | Enum('running', 'paused', 'completed', 'cancelled') | NOT NULL | Current state |
| `started_at` | DateTime (UTC) | NOT NULL | Start timestamp |
| `completed_at` | DateTime (UTC) | NULL | Completion timestamp |
| `paused_duration_ms` | Integer | DEFAULT 0 | Total time paused (milliseconds) |

**Indexes**:
- `idx_pomodoro_task_id` on (`task_id`)
- `idx_pomodoro_started_at` on (`started_at DESC`)
- `idx_pomodoro_state` on (`state`)

**SQLAlchemy Model**:

```python
# backend/src/models/pomodoro.py
from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
import enum

class SessionType(enum.Enum):
    focus = "focus"
    break_ = "break"

class SessionState(enum.Enum):
    running = "running"
    paused = "paused"
    completed = "completed"
    cancelled = "cancelled"

class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String, ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True, index=True)
    session_type = Column(Enum(SessionType), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    state = Column(Enum(SessionState), nullable=False, default=SessionState.running, index=True)
    started_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    completed_at = Column(DateTime, nullable=True)
    paused_duration_ms = Column(Integer, default=0)

    # Relationships
    task = relationship("Task", back_populates="pomodoro_sessions")
```

**Validation Rules**:
- `duration_minutes` must be > 0 (typically 25 for focus, 5 for break)
- `state` transitions: running ↔ paused → completed/cancelled
- `completed_at` must be NULL unless state is 'completed'

---

### 4. BrainDumpEntry

Represents a quickly-captured thought or distraction during focus sessions.

**Table**: `brain_dump_entries`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String (UUID) | PRIMARY KEY | Unique identifier |
| `content` | Text | NOT NULL | Captured thought/idea |
| `status` | Enum('inbox', 'converted', 'dismissed') | NOT NULL, DEFAULT 'inbox' | Processing status |
| `created_at` | DateTime (UTC) | NOT NULL, DEFAULT NOW | Capture timestamp |
| `processed_at` | DateTime (UTC) | NULL | When converted/dismissed |
| `converted_to_task_id` | String (UUID) | FOREIGN KEY (tasks.id) ON DELETE SET NULL | If converted to task |

**Indexes**:
- `idx_braindump_status` on (`status`)
- `idx_braindump_created_at` on (`created_at DESC`)

**SQLAlchemy Model**:

```python
# backend/src/models/brain_dump.py
from sqlalchemy import Column, String, Text, DateTime, Enum, ForeignKey
import enum

class BrainDumpStatus(enum.Enum):
    inbox = "inbox"
    converted = "converted"
    dismissed = "dismissed"

class BrainDumpEntry(Base):
    __tablename__ = "brain_dump_entries"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(Text, nullable=False)
    status = Column(Enum(BrainDumpStatus), nullable=False, default=BrainDumpStatus.inbox, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    processed_at = Column(DateTime, nullable=True)
    converted_to_task_id = Column(String, ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True)
```

**Validation Rules**:
- `content` must be 1-10,000 characters
- `status` transitions: inbox → converted/dismissed
- `processed_at` must be NULL if status is 'inbox'

---

### 5. Habit

Represents a daily routine to track with streak counting.

**Table**: `habits`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String (UUID) | PRIMARY KEY | Unique identifier |
| `name` | String(200) | NOT NULL | Habit name |
| `created_at` | DateTime (UTC) | NOT NULL, DEFAULT NOW | Creation timestamp |
| `archived` | Boolean | DEFAULT FALSE | If habit is archived |

**Indexes**:
- `idx_habits_archived` on (`archived`)
- `idx_habits_created_at` on (`created_at DESC`)

**SQLAlchemy Model**:

```python
# backend/src/models/habit.py
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.orm import relationship

class Habit(Base):
    __tablename__ = "habits"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    archived = Column(Boolean, default=False, index=True)

    # Relationships
    check_ins = relationship("HabitCheckIn", back_populates="habit", cascade="all, delete-orphan")
```

**Validation Rules**:
- `name` must be 1-200 characters
- Cannot have duplicate habit names (enforced in service layer)

---

### 6. HabitCheckIn

Represents a single completion of a Habit on a specific date.

**Table**: `habit_check_ins`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String (UUID) | PRIMARY KEY | Unique identifier |
| `habit_id` | String (UUID) | FOREIGN KEY (habits.id) ON DELETE CASCADE | Associated habit |
| `completed_at` | DateTime (UTC) | NOT NULL | Completion timestamp |

**Indexes**:
- `idx_habit_checkins_habit_id` on (`habit_id`)
- `idx_habit_checkins_completed_at` on (`completed_at DESC`)
- `unique_habit_date` UNIQUE on (`habit_id`, DATE(`completed_at`)) - Prevent duplicate check-ins per day

**SQLAlchemy Model**:

```python
# backend/src/models/habit.py (continued)
from sqlalchemy import UniqueConstraint

class HabitCheckIn(Base):
    __tablename__ = "habit_check_ins"
    __table_args__ = (
        # Prevent multiple check-ins per day (UTC date)
        UniqueConstraint('habit_id', 'completed_date', name='unique_habit_date'),
    )

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    habit_id = Column(String, ForeignKey("habits.id", ondelete="CASCADE"), nullable=False, index=True)
    completed_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    completed_date = Column(Date, nullable=False, default=lambda: datetime.utcnow().date())  # Computed for unique constraint

    # Relationships
    habit = relationship("Habit", back_populates="check_ins")
```

**Validation Rules**:
- Cannot have multiple check-ins for same habit on same date (UTC)
- `completed_at` must be <= current time

---

### 7. UserSettings

Stores user preferences. Singleton table (single row).

**Table**: `user_settings`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | Integer | PRIMARY KEY | Always 1 (singleton) |
| `focus_duration_minutes` | Integer | DEFAULT 25 | Pomodoro focus duration |
| `break_duration_minutes` | Integer | DEFAULT 5 | Break duration |
| `audio_enabled` | Boolean | DEFAULT TRUE | Enable audio notifications |
| `theme` | Enum('light', 'dark') | DEFAULT 'dark' | UI theme |
| `color_scheme` | Enum('default', 'forest') | DEFAULT 'default' | Color palette |
| `timezone` | String(50) | DEFAULT 'UTC' | IANA timezone (e.g., 'America/New_York') |
| `updated_at` | DateTime (UTC) | DEFAULT NOW | Last update timestamp |

**SQLAlchemy Model**:

```python
# backend/src/models/settings.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
import enum

class Theme(enum.Enum):
    light = "light"
    dark = "dark"

class ColorScheme(enum.Enum):
    default = "default"
    forest = "forest"

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, default=1)  # Singleton
    focus_duration_minutes = Column(Integer, default=25)
    break_duration_minutes = Column(Integer, default=5)
    audio_enabled = Column(Boolean, default=True)
    theme = Column(Enum(Theme), default=Theme.dark)
    color_scheme = Column(Enum(ColorScheme), default=ColorScheme.default)
    timezone = Column(String(50), default='UTC')
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

**Validation Rules**:
- `focus_duration_minutes` must be 1-60
- `break_duration_minutes` must be 1-30
- `timezone` must be valid IANA timezone string

---

## Database Initialization

**Alembic Migration (Initial):**

```python
# backend/alembic/versions/001_initial_schema.py
"""Initial schema

Revision ID: 001
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Create tables in dependency order
    op.create_table(
        'tasks',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_tasks_completed', 'tasks', ['completed'])
    op.create_index('idx_tasks_order', 'tasks', ['order'])
    op.create_index('idx_tasks_created_at', 'tasks', ['created_at'], unique=False)

    # ... create remaining tables

def downgrade():
    op.drop_table('habit_check_ins')
    op.drop_table('habits')
    op.drop_table('brain_dump_entries')
    op.drop_table('pomodoro_sessions')
    op.drop_table('micro_steps')
    op.drop_table('tasks')
    op.drop_table('user_settings')
```

---

## Summary

**Total Tables**: 7
**Total Relationships**: 4 (1:N)
**Indexes**: 15 (optimized for common queries)

**Key Design Decisions**:
1. **UUID Primary Keys**: Enables client-side generation for offline-first operation
2. **UTC Timestamps**: Consistent storage, convert to user timezone in application layer
3. **Cascade Deletes**: Automatic cleanup of dependent records (micro-steps, check-ins)
4. **Enum Types**: Type-safe status/state management
5. **Indexes**: Query optimization for list views and filters
6. **Singleton Settings**: Single user application pattern

All models align with Key Entities defined in spec.md and support functional requirements FR-001 through FR-020.
