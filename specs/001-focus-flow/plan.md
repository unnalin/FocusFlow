# Implementation Plan: FocusFlow - ADHD-Friendly Focus Tool

**Branch**: `001-focus-flow` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-focus-flow/spec.md`

## Summary

FocusFlow is an ADHD-friendly focus tool that helps users overcome starting difficulties and maintain concentration through single-task focus, visual Pomodoro timers, task breakdown into micro-steps, and brain dump capture. The application features an immersive, distraction-free interface with calming aesthetics inspired by Linear and Raycast.

**Technical Approach**: Full-stack web application with FastAPI + SQLite backend providing RESTful APIs, and React + Tailwind CSS frontend with precise client-side timer management. The architecture emphasizes offline-first operation, local data persistence, and real-time state synchronization.

## Technical Context

**Language/Version**:
- Backend: Python 3.11+
- Frontend: JavaScript/TypeScript (React 18+)

**Primary Dependencies**:
- Backend: FastAPI 0.104+, SQLAlchemy 2.0+, Pydantic 2.0+, uvicorn
- Frontend: React 18+, Tailwind CSS 3.4+, React Query (TanStack Query), Zustand (state management)
- Additional: Vite (build tool), Axios (HTTP client)

**Storage**: SQLite 3.x (local file-based database, single `focusflow.db` file)

**Testing**:
- Backend: pytest, pytest-asyncio, httpx (for FastAPI testing)
- Frontend: Vitest, React Testing Library, MSW (Mock Service Worker)
- E2E: Playwright

**Target Platform**:
- Primary: Desktop web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Secondary: Mobile web browsers (responsive design)
- Deployment: Can be packaged as Electron app for native desktop experience (future consideration)

**Project Type**: Web application (backend + frontend)

**Performance Goals**:
- Frontend load time: <2 seconds on standard hardware (SC-004)
- API response time: <100ms p95 for all CRUD operations
- Timer precision: ±1 second over 25-minute period
- UI interaction responsiveness: <16ms (60 fps animations)

**Constraints**:
- Offline-first: All features must work without internet connection
- Zero data loss: Continuous state persistence (FR-012, SC-005)
- Immersive UI: Full-screen by default, minimal distractions (FR-013, FR-016)
- Accessibility: WCAG 2.1 AA compliance for color contrast and keyboard navigation

**Scale/Scope**:
- Single-user application (no multi-user auth initially)
- Local data only (~1-10k tasks per user lifetime)
- Estimated ~15-20 React components
- ~10-15 API endpoints
- ~7 database tables (Task, MicroStep, PomodoroSession, BrainDumpEntry, Habit, HabitCheckIn, UserSettings)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: No project-specific constitution file found. Applying industry standard best practices:

### Pre-Research Checks

- [x] **Simplicity**: Architecture uses standard patterns (REST API, React SPA) without unnecessary abstractions
- [x] **Single Responsibility**: Backend handles data persistence, frontend handles UI and client-side timer logic
- [x] **Testability**: All functional requirements have corresponding acceptance scenarios; testing strategy defined
- [x] **Minimal Dependencies**: Core dependencies justified (FastAPI for async API, React for UI, Tailwind for styling)
- [x] **Offline-First**: SQLite enables local-first architecture per FR-011
- [x] **No Premature Optimization**: Starting with single-user, local-only design; can add sync/multi-user later if needed

### Post-Design Checks (To be verified after Phase 1)

- [ ] **Data model matches entities**: Verify 7 tables align with Key Entities from spec
- [ ] **API contracts cover functional requirements**: Ensure all FR-001 to FR-020 have corresponding endpoints
- [ ] **No scope creep**: Confirm design doesn't add features beyond specification
- [ ] **Performance testable**: Verify success criteria SC-001, SC-004, SC-005, SC-008 are measurable

## Project Structure

### Documentation (this feature)

```text
specs/001-focus-flow/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - tech decisions and patterns
├── data-model.md        # Phase 1 output - database schema and relationships
├── quickstart.md        # Phase 1 output - setup and development guide
├── contracts/           # Phase 1 output - API contracts
│   └── openapi.yaml     # OpenAPI 3.0 specification for all endpoints
└── checklists/
    └── requirements.md  # Spec validation checklist (completed)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration and environment variables
│   ├── database.py             # SQLAlchemy database setup and session management
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── task.py             # Task and MicroStep models
│   │   ├── pomodoro.py         # PomodoroSession model
│   │   ├── brain_dump.py       # BrainDumpEntry model
│   │   ├── habit.py            # Habit and HabitCheckIn models
│   │   └── settings.py         # UserSettings model
│   ├── schemas/                # Pydantic schemas for request/response validation
│   │   ├── __init__.py
│   │   ├── task.py
│   │   ├── pomodoro.py
│   │   ├── brain_dump.py
│   │   ├── habit.py
│   │   └── settings.py
│   ├── routers/                # FastAPI route handlers (API endpoints)
│   │   ├── __init__.py
│   │   ├── tasks.py            # Task and micro-step CRUD
│   │   ├── pomodoro.py         # Pomodoro session management
│   │   ├── brain_dump.py       # Brain dump CRUD
│   │   ├── habits.py           # Habit tracking and check-ins
│   │   └── settings.py         # User settings
│   ├── services/               # Business logic layer
│   │   ├── __init__.py
│   │   ├── task_service.py     # Task operations, micro-step logic
│   │   ├── pomodoro_service.py # Session state management
│   │   ├── habit_service.py    # Streak calculation logic
│   │   └── settings_service.py # Settings management
│   └── utils/                  # Utility functions
│       ├── __init__.py
│       └── datetime_utils.py   # Timezone and date helpers
├── tests/
│   ├── conftest.py             # Pytest fixtures and test database setup
│   ├── unit/                   # Unit tests for services and utils
│   │   ├── test_task_service.py
│   │   ├── test_pomodoro_service.py
│   │   └── test_habit_service.py
│   ├── integration/            # API integration tests
│   │   ├── test_tasks_api.py
│   │   ├── test_pomodoro_api.py
│   │   ├── test_brain_dump_api.py
│   │   ├── test_habits_api.py
│   │   └── test_settings_api.py
│   └── contract/               # Contract tests against OpenAPI spec
│       └── test_openapi_compliance.py
├── alembic/                    # Database migrations (if needed for schema changes)
│   ├── versions/
│   └── env.py
├── requirements.txt            # Python dependencies
├── requirements-dev.txt        # Development dependencies (pytest, etc.)
└── README.md                   # Backend setup instructions

frontend/
├── src/
│   ├── main.tsx                # Application entry point
│   ├── App.tsx                 # Root component with routing
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI components (buttons, inputs, modals)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Card.tsx
│   │   ├── Timer/              # Pomodoro timer components
│   │   │   ├── CircularTimer.tsx         # Visual countdown circle (FR-002)
│   │   │   ├── TimerControls.tsx         # Start/pause/stop controls
│   │   │   └── TimerDisplay.tsx          # Time remaining display
│   │   ├── Tasks/              # Task management components
│   │   │   ├── TaskList.tsx              # Draggable task list (FR-007)
│   │   │   ├── TaskItem.tsx              # Individual task with micro-steps
│   │   │   ├── TaskInput.tsx             # Quick task entry (FR-017)
│   │   │   ├── MicroStepList.tsx         # Micro-step breakdown (FR-006)
│   │   │   └── TaskCompletionAnimation.tsx  # Celebration feedback (FR-008)
│   │   ├── BrainDump/          # Brain dump feature
│   │   │   ├── BrainDumpInput.tsx        # Quick capture input (FR-005)
│   │   │   ├── BrainDumpInbox.tsx        # Inbox view
│   │   │   └── BrainDumpItem.tsx         # Individual entry
│   │   ├── Habits/             # Habit tracking components
│   │   │   ├── HabitList.tsx             # Today's habits (FR-010)
│   │   │   ├── HabitItem.tsx             # Individual habit with streak
│   │   │   └── HabitInput.tsx            # Create new habit
│   │   └── Settings/           # Settings panel
│   │       ├── SettingsModal.tsx         # Settings overlay
│   │       ├── ThemeSelector.tsx         # Dark/light mode toggle
│   │       └── TimerSettings.tsx         # Focus/break duration config
│   ├── pages/                  # Page-level components (routes)
│   │   ├── FocusPage.tsx       # Main focus mode view (P1)
│   │   ├── TasksPage.tsx       # Task management view (P2)
│   │   ├── HabitsPage.tsx      # Habit tracking view (P3)
│   │   └── BrainDumpPage.tsx   # Brain dump review page
│   ├── hooks/                  # Custom React hooks
│   │   ├── useTimer.ts         # Pomodoro timer logic with persistence
│   │   ├── useTasks.ts         # Task CRUD operations with React Query
│   │   ├── useHabits.ts        # Habit operations
│   │   ├── useBrainDump.ts     # Brain dump operations
│   │   ├── useSettings.ts      # Settings management
│   │   └── useKeyboardShortcuts.ts  # Global keyboard shortcuts
│   ├── store/                  # Zustand state management
│   │   ├── timerStore.ts       # Timer state (running, paused, current task)
│   │   ├── uiStore.ts          # UI state (theme, immersive mode)
│   │   └── persistenceMiddleware.ts  # LocalStorage sync middleware
│   ├── services/               # API client services
│   │   ├── api.ts              # Axios instance configuration
│   │   ├── taskService.ts      # Task API calls
│   │   ├── pomodoroService.ts  # Pomodoro API calls
│   │   ├── brainDumpService.ts # Brain dump API calls
│   │   ├── habitService.ts     # Habit API calls
│   │   └── settingsService.ts  # Settings API calls
│   ├── utils/                  # Utility functions
│   │   ├── timerUtils.ts       # Timer calculation helpers
│   │   ├── audioUtils.ts       # Audio notification handling (FR-004)
│   │   ├── persistenceUtils.ts # LocalStorage helpers
│   │   └── keyboardUtils.ts    # Keyboard shortcut helpers
│   ├── styles/                 # Global styles and Tailwind config
│   │   ├── globals.css         # Global CSS with Tailwind imports
│   │   └── themes.css          # Theme variables (dark/light, color schemes)
│   └── types/                  # TypeScript type definitions
│       ├── task.ts
│       ├── pomodoro.ts
│       ├── brainDump.ts
│       ├── habit.ts
│       └── settings.ts
├── public/
│   ├── audio/                  # Gentle notification sounds (FR-004)
│   │   ├── focus-complete.mp3
│   │   └── break-complete.mp3
│   └── favicon.ico
├── tests/
│   ├── setup.ts                # Test environment setup
│   ├── unit/                   # Component unit tests
│   │   ├── Timer.test.tsx
│   │   ├── TaskList.test.tsx
│   │   └── HabitTracker.test.tsx
│   ├── integration/            # Feature integration tests
│   │   ├── focus-session.test.tsx
│   │   ├── task-management.test.tsx
│   │   └── habit-tracking.test.tsx
│   └── e2e/                    # Playwright end-to-end tests
│       ├── pomodoro-flow.spec.ts
│       ├── task-flow.spec.ts
│       └── offline-mode.spec.ts
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # NPM dependencies and scripts
└── README.md                   # Frontend setup instructions

focusflow.db                    # SQLite database file (gitignored, created at runtime)
.env                            # Environment variables (gitignored)
.env.example                    # Environment variable template
docker-compose.yml              # Optional: Docker setup for development
README.md                       # Root project README
```

**Structure Decision**:

Selected **Option 2: Web application** structure due to user specification of FastAPI backend + React frontend. This separates concerns clearly:

- **Backend**: Pure API server with no frontend responsibilities. Handles data persistence, business logic (streak calculation, task completion), and provides RESTful endpoints. Uses SQLite for simplicity and offline-first requirement.

- **Frontend**: Single-page application (SPA) with client-side routing. Handles all UI rendering, timer management (precise countdown), and local state persistence. Uses LocalStorage + backend sync pattern to ensure offline operation (FR-011, SC-009).

**Key Architectural Decisions**:

1. **Timer Management**: Frontend-driven timer using `setInterval` with drift correction ensures precise countdown (Performance Goal: ±1 second accuracy). Backend stores session metadata but doesn't manage active timers.

2. **Offline-First Pattern**:
   - Frontend maintains full application state in LocalStorage
   - API calls are optimistic updates (update UI immediately, sync to backend)
   - Backend serves as source of truth for persistence across sessions
   - Service Worker (future consideration) can cache API responses

3. **State Management**: Zustand for global state (timer, UI theme) + React Query for server state (tasks, habits). This separates concerns and provides automatic caching/invalidation.

4. **Styling Approach**: Tailwind CSS utility classes for rapid development + custom CSS variables for theming (dark/light mode). Inspired by Linear's clean lines and Raycast's minimal aesthetic.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. Architecture follows standard web application patterns with appropriate separation of concerns.

## Phase 0: Research & Technical Decisions

**Status**: To be completed by research agents

The following areas require research and best practice investigation:

### Research Tasks

1. **Timer Precision in Browser**
   - Question: What's the best approach for accurate Pomodoro timer in React?
   - Context: Need ±1 second accuracy over 25 minutes (Performance Goal)
   - Research: `setInterval` vs `requestAnimationFrame` vs Web Workers for timer implementation
   - Investigate: Drift correction algorithms, handling tab backgrounding (Page Visibility API)

2. **Offline-First State Management**
   - Question: How to ensure zero data loss with offline-first React + backend sync?
   - Context: FR-011 (persist all data), SC-005 (100% state recovery)
   - Research: LocalStorage vs IndexedDB for frontend persistence
   - Investigate: Optimistic UI updates, conflict resolution patterns, sync queue management

3. **FastAPI + SQLite Best Practices**
   - Question: What's the optimal SQLite configuration for single-user FastAPI app?
   - Context: ~10k tasks, concurrent read/writes during timer updates
   - Research: SQLAlchemy async vs sync drivers, connection pooling for SQLite
   - Investigate: WAL (Write-Ahead Logging) mode, transaction strategies

4. **Audio Notification Implementation**
   - Question: How to ensure gentle audio plays reliably across browsers?
   - Context: FR-004 (gentle notification when timer completes)
   - Research: Web Audio API vs HTML5 `<audio>` element
   - Investigate: Browser autoplay policies, user permission requirements

5. **Drag-and-Drop Task Reordering**
   - Question: Best library/approach for accessible drag-and-drop in React?
   - Context: FR-007 (drag-and-drop task reordering)
   - Research: `@dnd-kit/core` vs `react-beautiful-dnd` vs native HTML5 drag-and-drop
   - Investigate: Touch device support, keyboard accessibility (WCAG 2.1)

6. **Immersive/Full-Screen Mode**
   - Question: How to implement distraction-free full-screen mode in web app?
   - Context: FR-013 (full-screen by default), FR-016 (hide secondary UI)
   - Research: Fullscreen API browser support, keyboard shortcut best practices
   - Investigate: Exit strategies (ESC key, subtle UI hints), mobile considerations

7. **Tailwind CSS Theming for ADHD-Friendly UI**
   - Question: How to implement Linear/Raycast-style minimal design with Tailwind?
   - Context: User Story 6 (ADHD-optimized visual design), high contrast + calming colors
   - Research: Tailwind theme customization, CSS custom properties for theme switching
   - Investigate: Dark mode implementation, color palette selection (forest green option)

8. **Animation Performance**
   - Question: How to ensure smooth 60fps animations for task completion feedback?
   - Context: FR-008 (visual feedback), Performance Goal (16ms interactions)
   - Research: CSS transitions vs React Spring vs Framer Motion
   - Investigate: Animation best practices for low-end devices

9. **Habit Streak Calculation Logic**
   - Question: What's the algorithm for streak calculation with timezone handling?
   - Context: FR-009 (streak counters), edge case (habit at 11:59 PM)
   - Research: Timezone-aware date comparison in Python and JavaScript
   - Investigate: Streak reset rules, handling missed days

10. **Testing Strategy for Timer-Based Features**
    - Question: How to test time-dependent Pomodoro logic without waiting 25 minutes?
    - Context: User Story 1 acceptance scenarios, timer state transitions
    - Research: Jest/Vitest timer mocking, pytest-freezegun for backend
    - Investigate: E2E testing with Playwright's clock manipulation

**Output**: `research.md` with decisions, rationale, and code examples for each area

## Phase 1: Design & Contracts

**Status**: Pending (awaits Phase 0 completion)

### Deliverables

1. **data-model.md**: Database schema design
   - 7 SQLAlchemy models based on Key Entities from spec
   - Table relationships (Task → MicroStep one-to-many, etc.)
   - Indexes for performance (e.g., on `created_at`, `completion_status`)
   - Validation rules (Pydantic constraints)

2. **contracts/openapi.yaml**: API contract specification
   - ~10-15 REST endpoints covering all functional requirements
   - Request/response schemas with examples
   - Error response formats (4xx, 5xx)
   - Example endpoints:
     - `POST /api/tasks` - Create task
     - `GET /api/tasks` - List tasks with optional filters
     - `PUT /api/tasks/{id}/reorder` - Update task order
     - `POST /api/pomodoro/sessions` - Start focus session
     - `PUT /api/pomodoro/sessions/{id}/state` - Pause/resume timer
     - `POST /api/brain-dump` - Quick capture
     - `POST /api/habits/{id}/check-in` - Mark habit complete

3. **quickstart.md**: Developer setup guide
   - Prerequisites (Python 3.11+, Node 18+, SQLite)
   - Backend setup (venv, install dependencies, run migrations, start server)
   - Frontend setup (npm install, environment variables, dev server)
   - Testing instructions (run backend tests, frontend tests, E2E tests)
   - Common development workflows

4. **Agent Context Update**
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude`
   - Add technologies: FastAPI, React, Tailwind CSS, SQLite, SQLAlchemy
   - Preserve any existing manual additions

### Design Principles

- **RESTful API Design**: Use standard HTTP methods (GET, POST, PUT, DELETE), proper status codes
- **Pydantic Validation**: All request/response bodies validated with Pydantic schemas
- **Stateless Backend**: Timer state stored, but countdown logic is frontend-driven
- **Idempotency**: PUT/DELETE operations idempotent for reliable offline sync
- **Versioned API**: Use `/api/v1/` prefix for future-proofing

## Phase 2: Task Breakdown

**Status**: Not started (separate `/speckit.tasks` command)

Phase 2 generates `tasks.md` with dependency-ordered implementation tasks. This is a separate workflow step invoked after plan approval.

## Next Steps

1. **Review this plan**: Ensure technical approach aligns with requirements
2. **Run research phase**: Execute Phase 0 to resolve all "NEEDS CLARIFICATION" items
3. **Generate artifacts**: Complete Phase 1 to produce data-model.md, contracts/, quickstart.md
4. **Proceed to tasks**: Run `/speckit.tasks` to generate actionable implementation tasks

## Notes

- **Linear/Raycast Inspiration**: Research should include screenshots/examples of minimal UI patterns from these apps
- **Timer Precision Critical**: Extra attention needed on timer implementation research (affects SC-002, SC-008)
- **Offline-First Non-Negotiable**: All research decisions must support SC-009 (fully functional offline)
- **Accessibility**: WCAG 2.1 AA compliance required (keyboard navigation, contrast ratios)
- **Future Considerations**:
  - Electron packaging for native desktop app
  - Cloud sync for multi-device usage
  - Mobile native apps (React Native code sharing)
  - Analytics dashboard (completed sessions, productivity insights)
