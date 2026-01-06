# FocusFlow Quickstart Guide

**Last Updated**: 2026-01-06

This guide will get you up and running with FocusFlow development environment in ~10 minutes.

---

## Prerequisites

Ensure you have the following installed:

- **Python**: 3.11 or higher
- **Node.js**: 18.x or higher (LTS recommended)
- **npm**: 9.x or higher (comes with Node.js)
- **SQLite**: 3.x (usually pre-installed on macOS/Linux, included with Python on Windows)
- **Git**: For version control

**Optional but Recommended**:
- **VS Code**: With Python and TypeScript extensions
- **Postman** or **Insomnia**: For API testing

---

## Project Structure Overview

```
E:\MyAiDemo\
├── backend/                  # FastAPI + SQLite backend
│   ├── src/                  # Application source code
│   ├── tests/                # pytest test suite
│   ├── requirements.txt      # Python dependencies
│   └── README.md
├── frontend/                 # React + Tailwind CSS frontend
│   ├── src/                  # Application source code
│   ├── tests/                # Vitest + Playwright tests
│   ├── package.json          # NPM dependencies
│   └── README.md
├── focusflow.db              # SQLite database (auto-created)
└── specs/001-focus-flow/     # This feature's documentation
    ├── spec.md
    ├── plan.md
    ├── research.md
    ├── data-model.md
    ├── contracts/openapi.yaml
    └── quickstart.md (this file)
```

---

## Backend Setup (FastAPI + SQLite)

### 1. Navigate to Backend Directory

```bash
cd E:\MyAiDemo\backend
```

### 2. Create Python Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies (pytest, etc.)
```

**Expected `requirements.txt` contents**:
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy[asyncio]==2.0.23
aiosqlite==0.19.0
pydantic==2.5.0
pydantic-settings==2.1.0
python-dotenv==1.0.0
```

**Expected `requirements-dev.txt` contents**:
```
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.1
black==23.11.0
flake8==6.1.0
mypy==1.7.0
```

### 4. Configure Environment Variables

Create `.env` file in `backend/` directory:

```bash
# backend/.env
DATABASE_URL=sqlite+aiosqlite:///./focusflow.db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
ENVIRONMENT=development
LOG_LEVEL=INFO
```

### 5. Initialize Database

```bash
# Run database initialization
python -m src.database

# Or with Alembic (if using migrations)
alembic upgrade head
```

### 6. Run Backend Server

```bash
uvicorn src.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 7. Verify Backend is Running

Open browser to:
- **API Docs (Swagger UI)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/v1/health (returns `{"status": "ok"}`)

### 8. Run Backend Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/unit/test_task_service.py -v

# Run integration tests only
pytest tests/integration/ -v
```

---

## Frontend Setup (React + Tailwind CSS)

### 1. Navigate to Frontend Directory

```bash
cd E:\MyAiDemo\frontend
```

### 2. Install Dependencies

```bash
npm install
```

**Expected `package.json` dependencies**:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.8.0",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "framer-motion": "^10.16.4",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "typescript": "^5.2.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.3.5",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  }
}
```

### 3. Configure Environment Variables

Create `.env` file in `frontend/` directory:

```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=FocusFlow
VITE_ENVIRONMENT=development
```

### 4. Run Frontend Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.0.0  ready in 342 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

### 5. Verify Frontend is Running

Open browser to: http://localhost:5173

You should see the FocusFlow landing page with:
- Minimal, clean interface (dark mode by default)
- "Start Focus" button
- Empty task list
- Settings icon (subtle, in corner)

### 6. Run Frontend Tests

```bash
# Run unit/integration tests (Vitest)
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run E2E tests (Playwright)
npm run test:e2e

# Run E2E in headed mode (see browser)
npm run test:e2e:headed
```

---

## Development Workflow

### Typical Development Session

1. **Start Backend** (Terminal 1):
   ```bash
   cd E:\MyAiDemo\backend
   venv\Scripts\activate  # or source venv/bin/activate
   uvicorn src.main:app --reload --port 8000
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd E:\MyAiDemo\frontend
   npm run dev
   ```

3. **Run Tests** (Terminal 3):
   ```bash
   # Backend tests
   cd E:\MyAiDemo\backend
   pytest --watch

   # OR Frontend tests
   cd E:\MyAiDemo\frontend
   npm run test:watch
   ```

### Hot Reloading

Both backend and frontend support hot reloading:
- **Backend**: `--reload` flag auto-restarts on file changes
- **Frontend**: Vite HMR updates instantly without page refresh

---

## Common Development Tasks

### Create a New Task (via API)

```bash
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task from curl"}'
```

### Start a Pomodoro Session

```bash
curl -X POST http://localhost:8000/api/v1/pomodoro/sessions \
  -H "Content-Type: application/json" \
  -d '{"task_id": "task-123", "session_type": "focus", "duration_minutes": 25}'
```

### View Database Contents

**Using SQLite CLI**:
```bash
sqlite3 focusflow.db

# Show all tables
.tables

# Query tasks
SELECT * FROM tasks;

# Exit
.quit
```

**Using Python**:
```python
import sqlite3
conn = sqlite3.connect('focusflow.db')
cursor = conn.cursor()
cursor.execute("SELECT * FROM tasks")
print(cursor.fetchall())
conn.close()
```

### Reset Database

```bash
# Delete database file
rm focusflow.db  # or del focusflow.db on Windows

# Recreate database
cd backend
python -m src.database
# or: alembic upgrade head
```

---

## Debugging Tips

### Backend Debugging

**Enable SQL Logging**:
```python
# backend/src/database.py
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Set to True to see all SQL queries
)
```

**Use VS Code Debugger**:
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["src.main:app", "--reload", "--port", "8000"],
      "jinja": true,
      "justMyCode": false
    }
  ]
}
```

**Check Logs**:
```bash
# Backend logs to console by default
# Add file logging if needed in src/main.py
```

### Frontend Debugging

**React DevTools**: Install browser extension

**Inspect Network Requests**:
- Open browser DevTools (F12)
- Network tab → Filter by "XHR"
- See all API calls to backend

**Inspect State Management**:
- Zustand DevTools: Add middleware in development
- React Query DevTools: Already included (bottom-left corner)

**Console Logging**:
```typescript
// Add console logs for debugging
console.log('[Timer] Starting:', { duration, taskId });
```

---

## Testing Guidelines

### Backend Tests

**Unit Tests**:
```python
# tests/unit/test_task_service.py
import pytest
from src.services.task_service import TaskService

@pytest.mark.asyncio
async def test_create_task():
    service = TaskService()
    task = await service.create(title="Test task")
    assert task.title == "Test task"
    assert task.completed == False
```

**Integration Tests**:
```python
# tests/integration/test_tasks_api.py
import pytest
from httpx import AsyncClient
from src.main import app

@pytest.mark.asyncio
async def test_list_tasks():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/tasks")
        assert response.status_code == 200
        assert "tasks" in response.json()
```

### Frontend Tests

**Component Tests**:
```typescript
// src/components/Timer/__tests__/PomodoroTimer.test.tsx
import { render, screen } from '@testing-library/react';
import { PomodoroTimer } from '../PomodoroTimer';

describe('PomodoroTimer', () => {
  it('renders timer display', () => {
    render(<PomodoroTimer />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });
});
```

**E2E Tests**:
```typescript
// tests/e2e/focus-session.spec.ts
import { test, expect } from '@playwright/test';

test('complete focus session', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.fill('input[placeholder="What are you working on?"]', 'Test task');
  await page.click('button:text("Start Focus")');
  await expect(page.locator('[data-testid="timer-display"]')).toContainText('25:00');
});
```

---

## Troubleshooting

### Backend Won't Start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Activate virtual environment and reinstall dependencies
  ```bash
  venv\Scripts\activate
  pip install -r requirements.txt
  ```

**Error**: `sqlite3.OperationalError: database is locked`
- **Solution**: Close any SQLite browser tools or other connections
- Enable WAL mode (should be automatic in `database.py`)

**Error**: `Address already in use: port 8000`
- **Solution**: Kill existing process or use different port
  ```bash
  # Windows
  netstat -ano | findstr :8000
  taskkill /PID <PID> /F

  # macOS/Linux
  lsof -i :8000
  kill -9 <PID>
  ```

### Frontend Won't Start

**Error**: `EADDRINUSE: address already in use :::5173`
- **Solution**: Kill existing Vite process or change port
  ```bash
  npm run dev -- --port 3000
  ```

**Error**: `Cannot find module '@tanstack/react-query'`
- **Solution**: Re-install dependencies
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Error**: `CORS policy error in browser console`
- **Solution**: Check `backend/.env` has correct `CORS_ORIGINS`
  ```
  CORS_ORIGINS=http://localhost:5173,http://localhost:3000
  ```

### Tests Failing

**Backend Tests**:
```bash
# Clear pytest cache
rm -rf .pytest_cache

# Run with verbose output
pytest -vv -s
```

**Frontend Tests**:
```bash
# Clear Vitest cache
rm -rf node_modules/.vite

# Update snapshots
npm run test -- -u
```

---

## Next Steps

After completing this quickstart:

1. **Read Documentation**:
   - `spec.md` - Feature requirements
   - `data-model.md` - Database schema
   - `contracts/openapi.yaml` - API specification
   - `research.md` - Technical decisions

2. **Explore Codebase**:
   - Backend: Start with `src/main.py` and `src/routers/`
   - Frontend: Start with `src/App.tsx` and `src/pages/`

3. **Run Full Test Suite**:
   ```bash
   # Backend
   cd backend && pytest --cov=src

   # Frontend
   cd frontend && npm run test:coverage && npm run test:e2e
   ```

4. **Start Development**:
   - Pick a task from `tasks.md` (once generated via `/speckit.tasks`)
   - Create feature branch
   - Write tests first (TDD)
   - Implement feature
   - Run tests and verify
   - Commit changes

---

## Useful Commands Reference

### Backend

```bash
# Start server
uvicorn src.main:app --reload

# Run tests
pytest

# Format code
black src/ tests/

# Type checking
mypy src/

# Linting
flake8 src/

# Database migrations
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
npm run test:e2e

# Format code
npm run format

# Linting
npm run lint

# Type checking
npm run type-check
```

---

## Getting Help

- **API Documentation**: http://localhost:8000/docs (when backend running)
- **Feature Spec**: `specs/001-focus-flow/spec.md`
- **Research Decisions**: `specs/001-focus-flow/research.md`
- **OpenAPI Contract**: `specs/001-focus-flow/contracts/openapi.yaml`

**Having issues?** Check the Troubleshooting section above or review error logs in terminal output.

---

**Happy Coding! 🚀**
