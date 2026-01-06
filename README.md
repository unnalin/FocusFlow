# FocusFlow 

给我自己做的一个自用小工具合集，主要包括番茄钟todo，其他的待开发，准备做一下todolist，赛博日记之类的

爱来自claude code + openspec

## Features

- 🎯 Single-task focus with 25-minute Pomodoro sessions
- 🌙 Dark/light theme support
- 🎨 Immersive distraction-free mode
- ⌨️ Keyboard shortcuts
- 💾 State persistence (resume after page refresh)
- 🔊 Audio notifications (gentle completion sounds)

## Setup

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env

# Run migrations
alembic upgrade head

# Start server
uvicorn src.main:app --reload
```

Backend will run on http://localhost:8000

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

## Project Structure

```
backend/
  src/
    models/      # SQLAlchemy models
    schemas/     # Pydantic schemas
    services/    # Business logic
    routers/     # API endpoints
    utils/       # Utilities
  alembic/       # Database migrations

frontend/
  src/
    components/  # React components
    hooks/       # Custom hooks
    pages/       # Page components
    services/    # API services
    store/       # Zustand state management
    styles/      # CSS styles
    types/       # TypeScript types
    utils/       # Utilities
```

## MVP Tasks Completed

✓ Phase 1: Project setup (8 tasks)
✓ Phase 2: Foundational infrastructure (14 tasks)
✓ Phase 3: ADHD-optimized UI (10 tasks)
✓ Phase 4: Focus Timer MVP (26 tasks)

**Total: 58/58 MVP tasks complete**

## Next Steps

After MVP validation, you can add:
- User Story 2: Brain dump for capturing intrusive thoughts
- User Story 3: Task breakdown into micro-steps
- User Story 4: Minimal task list view
- User Story 5: Daily habit tracking with streaks
