# Tasks: FocusFlow - ADHD-Friendly Focus Tool

**Input**: Design documents from `/specs/001-focus-flow/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5, US6)
- Include exact file paths in descriptions

## Path Conventions (Web Application)

- Backend: `backend/src/`, `backend/tests/`
- Frontend: `frontend/src/`, `frontend/tests/`
- Database: `focusflow.db` (auto-created at repository root)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project directory structure (backend/, frontend/) per plan.md
- [ ] T002 Initialize Python backend with requirements.txt (FastAPI, SQLAlchemy, aiosqlite, Pydantic, uvicorn)
- [ ] T003 Initialize React frontend with package.json (React 18, Vite, TypeScript, Tailwind CSS, Zustand, React Query, @dnd-kit)
- [ ] T004 [P] Configure Python linting and formatting (black, flake8, mypy) in backend/
- [ ] T005 [P] Configure TypeScript and ESLint in frontend/
- [ ] T006 [P] Setup Tailwind CSS configuration in frontend/tailwind.config.js with ADHD-friendly theme colors from research.md
- [ ] T007 [P] Create .env.example files for backend/ and frontend/ with required environment variables
- [ ] T008 [P] Setup .gitignore for Python (venv/, focusflow.db) and Node.js (node_modules/, .env)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [ ] T009 Setup SQLAlchemy database configuration in backend/src/database.py (async engine, WAL mode pragmas)
- [ ] T010 Initialize Alembic for database migrations in backend/alembic/
- [ ] T011 [P] Create FastAPI application entry point in backend/src/main.py with CORS middleware
- [ ] T012 [P] Create base Pydantic schemas structure in backend/src/schemas/__init__.py
- [ ] T013 [P] Setup error handling and logging in backend/src/utils/
- [ ] T014 Create health check endpoint in backend/src/main.py (GET /api/v1/health)

### Frontend Foundation

- [ ] T015 Setup React App component in frontend/src/App.tsx with router (React Router DOM)
- [ ] T016 [P] Create Zustand store structure in frontend/src/store/ (timerStore.ts, uiStore.ts with persist middleware)
- [ ] T017 [P] Setup React Query client configuration in frontend/src/main.tsx
- [ ] T018 [P] Create Axios instance configuration in frontend/src/services/api.ts with base URL
- [ ] T019 [P] Create global CSS and theme setup in frontend/src/styles/ (globals.css, themes.css with dark/light mode)
- [ ] T020 [P] Implement useKeyboardShortcuts hook in frontend/src/hooks/useKeyboardShortcuts.ts
- [ ] T021 [P] Implement usePageVisibility hook in frontend/src/hooks/usePageVisibility.ts
- [ ] T022 Create base UI components in frontend/src/components/ui/ (Button.tsx, Input.tsx, Card.tsx, Modal.tsx)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 6 - ADHD-Optimized Visual Design (Priority: P1) 🎯 Foundation

**Goal**: Establish distraction-free, high-contrast interface with calming colors that all other features will use

**Independent Test**: Visual inspection confirms full-screen immersive mode, high contrast, generous spacing, smooth animations, and keyboard shortcuts work

**Why First**: This is UI/UX foundation that User Story 1 (focus timer) depends on for proper ADHD-friendly presentation

### Implementation for User Story 6

- [ ] T023 [P] [US6] Implement immersive mode toggle in frontend/src/store/uiStore.ts (default: true)
- [ ] T024 [P] [US6] Create theme toggle component in frontend/src/components/Settings/ThemeSelector.tsx
- [ ] T025 [P] [US6] Implement color scheme selector in frontend/src/components/Settings/ColorSchemeSelector.tsx (default, forest)
- [ ] T026 [US6] Apply immersive mode styles to App.tsx (full-screen, hidden sidebars, ESC key exit hint)
- [ ] T027 [P] [US6] Create animation utilities in frontend/src/styles/ (fade-in, slide-up, scale-in keyframes)
- [ ] T028 [P] [US6] Implement UserSettings model in backend/src/models/settings.py
- [ ] T029 [P] [US6] Create UserSettings Pydantic schemas in backend/src/schemas/settings.py
- [ ] T030 [US6] Implement settings service in backend/src/services/settings_service.py (get/update singleton)
- [ ] T031 [US6] Create settings router in backend/src/routers/settings.py (GET/PUT /api/v1/settings)
- [ ] T032 [US6] Create SettingsModal component in frontend/src/components/Settings/SettingsModal.tsx with keyboard shortcut trigger

**Checkpoint**: ADHD-friendly UI foundation complete - focus timer can now be built on top

---

## Phase 4: User Story 1 - Single-Task Focus with Pomodoro Timer (Priority: P1) 🎯 MVP CORE

**Goal**: Enable users to focus on one task with visual countdown timer, completing 25-minute sessions with gentle audio notifications and state persistence

**Independent Test**: Create a task, start timer, verify circular countdown, complete 25-minute session (or fast-forward with clock manipulation), hear audio notification, enter break mode, restore state after page refresh

### Backend Implementation for User Story 1

- [ ] T033 [P] [US1] Create Task model in backend/src/models/task.py (id, title, description, completed, order, timestamps)
- [ ] T034 [P] [US1] Create PomodoroSession model in backend/src/models/pomodoro.py (id, task_id, session_type, duration, state, timestamps, paused_duration_ms)
- [ ] T035 [P] [US1] Create Task Pydantic schemas in backend/src/schemas/task.py (TaskCreate, TaskUpdate, TaskResponse)
- [ ] T036 [P] [US1] Create PomodoroSession Pydantic schemas in backend/src/schemas/pomodoro.py (PomodoroSessionCreate, PomodoroSessionResponse)
- [ ] T037 [US1] Implement task service in backend/src/services/task_service.py (create, get, update, delete, list)
- [ ] T038 [US1] Implement pomodoro service in backend/src/services/pomodoro_service.py (create session, update state, get active, get stats)
- [ ] T039 [US1] Create tasks router in backend/src/routers/tasks.py (GET/POST/PUT/DELETE /api/v1/tasks, GET /api/v1/tasks/{id})
- [ ] T040 [US1] Create pomodoro router in backend/src/routers/pomodoro.py (POST/GET/PUT /api/v1/pomodoro/sessions, GET /active, GET /stats/today)
- [ ] T041 [US1] Run Alembic migration to create tasks and pomodoro_sessions tables

### Frontend Implementation for User Story 1

- [ ] T042 [P] [US1] Implement useTimer hook in frontend/src/hooks/useTimer.ts (drift correction, localStorage persistence per research.md)
- [ ] T043 [P] [US1] Create audioUtils in frontend/src/utils/audioUtils.ts (AudioManager class, preload focus-complete.mp3 and break-complete.mp3)
- [ ] T044 [P] [US1] Add audio files to frontend/public/audio/ (focus-complete.mp3, break-complete.mp3)
- [ ] T045 [P] [US1] Create Task type definitions in frontend/src/types/task.ts
- [ ] T046 [P] [US1] Create PomodoroSession type definitions in frontend/src/types/pomodoro.ts
- [ ] T047 [P] [US1] Implement task API service in frontend/src/services/taskService.ts (create, get, update, delete, list)
- [ ] T048 [P] [US1] Implement pomodoro API service in frontend/src/services/pomodoroService.ts (createSession, updateState, getActive, getStats)
- [ ] T049 [US1] Create useTasks hook in frontend/src/hooks/useTasks.ts (React Query, optimistic updates)
- [ ] T050 [US1] Update timerStore in frontend/src/store/timerStore.ts (currentTaskId, sessionType, completedToday)
- [ ] T051 [P] [US1] Create CircularTimer component in frontend/src/components/Timer/CircularTimer.tsx (SVG circular countdown from research.md)
- [ ] T052 [P] [US1] Create TimerDisplay component in frontend/src/components/Timer/TimerDisplay.tsx (MM:SS format)
- [ ] T053 [P] [US1] Create TimerControls component in frontend/src/components/Timer/TimerControls.tsx (start/pause/stop buttons)
- [ ] T054 [P] [US1] Create TaskInput component in frontend/src/components/Tasks/TaskInput.tsx (quick entry with Enter key)
- [ ] T055 [US1] Create FocusPage in frontend/src/pages/FocusPage.tsx (single task display, circular timer, immersive mode)
- [ ] T056 [US1] Integrate audio notifications in useTimer hook (play on completion)
- [ ] T057 [US1] Implement timer state restoration in App.tsx (on mount, check localStorage, offer resume dialog)
- [ ] T058 [US1] Add routing for FocusPage in App.tsx (default route: /)

**Checkpoint**: MVP COMPLETE - Users can create task, start timer, complete 25-minute session, hear notification, persist state

---

## Phase 5: User Story 2 - Quick Task Capture with Brain Dump (Priority: P2)

**Goal**: Enable quick capture of intrusive thoughts during focus sessions without disrupting timer

**Independent Test**: Start focus session, press keyboard shortcut (e.g., Cmd+B), type thought, submit, verify saved without timer disruption, review inbox later

### Backend Implementation for User Story 2

- [ ] T059 [P] [US2] Create BrainDumpEntry model in backend/src/models/brain_dump.py (id, content, status, timestamps, converted_to_task_id)
- [ ] T060 [P] [US2] Create BrainDumpEntry Pydantic schemas in backend/src/schemas/brain_dump.py (BrainDumpCreate, BrainDumpUpdate, BrainDumpResponse)
- [ ] T061 [US2] Implement brain dump service in backend/src/services/brain_dump_service.py (create, get, update, delete, convert_to_task)
- [ ] T062 [US2] Create brain dump router in backend/src/routers/brain_dump.py (GET/POST/PUT/DELETE /api/v1/brain-dump, POST /convert-to-task)
- [ ] T063 [US2] Run Alembic migration to create brain_dump_entries table

### Frontend Implementation for User Story 2

- [ ] T064 [P] [US2] Create BrainDumpEntry type definitions in frontend/src/types/brainDump.ts
- [ ] T065 [P] [US2] Implement brain dump API service in frontend/src/services/brainDumpService.ts
- [ ] T066 [US2] Create useBrainDump hook in frontend/src/hooks/useBrainDump.ts (React Query)
- [ ] T067 [P] [US2] Create BrainDumpInput component in frontend/src/components/BrainDump/BrainDumpInput.tsx (minimal overlay during focus)
- [ ] T068 [P] [US2] Create BrainDumpInbox component in frontend/src/components/BrainDump/BrainDumpInbox.tsx (chronological list)
- [ ] T069 [P] [US2] Create BrainDumpItem component in frontend/src/components/BrainDump/BrainDumpItem.tsx (status actions, convert button)
- [ ] T070 [US2] Create BrainDumpPage in frontend/src/pages/BrainDumpPage.tsx
- [ ] T071 [US2] Integrate BrainDumpInput into FocusPage (keyboard shortcut: Cmd/Ctrl+B, minimal overlay)
- [ ] T072 [US2] Add routing for BrainDumpPage in App.tsx (/brain-dump)

**Checkpoint**: Users can capture thoughts during focus without disruption, review and process inbox later

---

## Phase 6: User Story 3 - Task Management with Micro-Steps (Priority: P2)

**Goal**: Enable task breakdown into micro-steps with drag-and-drop reordering and completion feedback

**Independent Test**: Create task, add 3 micro-steps, drag to reorder, complete one micro-step (see animation + hear sound), complete all (parent auto-completes with enhanced feedback)

### Backend Implementation for User Story 3

- [ ] T073 [P] [US3] Create MicroStep model in backend/src/models/task.py (id, task_id, title, completed, order, created_at)
- [ ] T074 [P] [US3] Create MicroStep Pydantic schemas in backend/src/schemas/task.py (MicroStepCreate, MicroStepUpdate, MicroStepResponse)
- [ ] T075 [US3] Update task service to support micro-steps (add_micro_step, update_micro_step, delete_micro_step, auto-complete parent)
- [ ] T076 [US3] Add micro-step endpoints to tasks router (POST/PUT/DELETE /api/v1/tasks/{id}/micro-steps, /micro-steps/{id})
- [ ] T077 [US3] Add bulk reorder endpoint to tasks router (PUT /api/v1/tasks/reorder)
- [ ] T078 [US3] Run Alembic migration to create micro_steps table

### Frontend Implementation for User Story 3

- [ ] T079 [P] [US3] Create MicroStep type definitions in frontend/src/types/task.ts
- [ ] T080 [P] [US3] Update task API service to support micro-steps and reordering
- [ ] T081 [P] [US3] Install @dnd-kit/core and @dnd-kit/sortable (already in package.json from T003)
- [ ] T082 [P] [US3] Create TaskCompletionAnimation component in frontend/src/components/Tasks/TaskCompletionAnimation.tsx (Framer Motion scale + fade)
- [ ] T083 [P] [US3] Create audioUtils completion sound trigger in frontend/src/utils/audioUtils.ts
- [ ] T084 [P] [US3] Create TaskList component in frontend/src/components/Tasks/TaskList.tsx (DndContext from research.md)
- [ ] T085 [P] [US3] Create SortableTaskItem component in frontend/src/components/Tasks/SortableTaskItem.tsx (useSortable hook)
- [ ] T086 [P] [US3] Create TaskItem component in frontend/src/components/Tasks/TaskItem.tsx (display task with micro-steps)
- [ ] T087 [P] [US3] Create MicroStepList component in frontend/src/components/Tasks/MicroStepList.tsx
- [ ] T088 [P] [US3] Create MicroStepInput component in frontend/src/components/Tasks/MicroStepInput.tsx (quick add)
- [ ] T089 [US3] Integrate task completion animation and audio feedback into TaskItem
- [ ] T090 [US3] Implement auto-complete parent task logic when all micro-steps done (with enhanced feedback)
- [ ] T091 [US3] Update FocusPage to display micro-steps of current task (select which to work on)

**Checkpoint**: Users can break down tasks, reorder with drag-drop, get satisfying feedback on completion

---

## Phase 7: User Story 4 - Minimal Task List with Quick Entry (Priority: P3)

**Goal**: Provide clean task list with keyboard shortcuts and persistence

**Independent Test**: Open app, press keyboard shortcut (e.g., Cmd+N), add 5 tasks quickly with Enter key, close app, reopen, verify all tasks restored

### Frontend Implementation for User Story 4

- [ ] T092 [P] [US4] Create TasksPage in frontend/src/pages/TasksPage.tsx (minimal list view)
- [ ] T093 [US4] Integrate TaskList component into TasksPage (reuse from US3)
- [ ] T094 [US4] Add keyboard shortcut for "Add Task" (Cmd/Ctrl+N) in useKeyboardShortcuts hook
- [ ] T095 [US4] Implement quick task entry with Enter key in TaskInput component (already created in T054)
- [ ] T096 [US4] Add visual distinction for completed tasks (strikethrough, faded color) in TaskItem styles
- [ ] T097 [US4] Add routing for TasksPage in App.tsx (/tasks)
- [ ] T098 [US4] Verify localStorage persistence for tasks (already implemented in useTasks hook from T049)

**Checkpoint**: Users have dedicated task list page with quick entry and full persistence

---

## Phase 8: User Story 5 - Daily Habit Tracking with Streaks (Priority: P3)

**Goal**: Enable daily habit tracking with streak calculation (consecutive days)

**Independent Test**: Create habit "Morning meditation", check in today, verify streak=1, check in tomorrow (fast-forward clock), verify streak=2, skip a day, verify streak reset

### Backend Implementation for User Story 5

- [ ] T099 [P] [US5] Create Habit model in backend/src/models/habit.py (id, name, created_at, archived)
- [ ] T100 [P] [US5] Create HabitCheckIn model in backend/src/models/habit.py (id, habit_id, completed_at, completed_date with unique constraint)
- [ ] T101 [P] [US5] Create Habit Pydantic schemas in backend/src/schemas/habit.py (HabitCreate, HabitUpdate, HabitResponse)
- [ ] T102 [P] [US5] Create HabitCheckIn Pydantic schemas in backend/src/schemas/habit.py (HabitCheckInResponse)
- [ ] T103 [US5] Implement habit service in backend/src/services/habit_service.py (create, get, update, delete, check_in, calculate_streak with timezone logic from research.md)
- [ ] T104 [US5] Create habits router in backend/src/routers/habits.py (GET/POST/PUT/DELETE /api/v1/habits, POST /check-in, GET /streak)
- [ ] T105 [US5] Run Alembic migration to create habits and habit_check_ins tables

### Frontend Implementation for User Story 5

- [ ] T106 [P] [US5] Create Habit type definitions in frontend/src/types/habit.ts
- [ ] T107 [P] [US5] Implement habit API service in frontend/src/services/habitService.ts
- [ ] T108 [US5] Create useHabits hook in frontend/src/hooks/useHabits.ts (React Query)
- [ ] T109 [P] [US5] Create HabitList component in frontend/src/components/Habits/HabitList.tsx (today's habits only)
- [ ] T110 [P] [US5] Create HabitItem component in frontend/src/components/Habits/HabitItem.tsx (checkmark, streak display)
- [ ] T111 [P] [US5] Create HabitInput component in frontend/src/components/Habits/HabitInput.tsx (create new habit)
- [ ] T112 [US5] Create HabitsPage in frontend/src/pages/HabitsPage.tsx
- [ ] T113 [US5] Add routing for HabitsPage in App.tsx (/habits)

**Checkpoint**: Users can track daily habits with streak counts, see only today's habits to reduce anxiety

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect multiple user stories

- [ ] T114 [P] Add comprehensive error boundaries in frontend/src/App.tsx (catch React errors gracefully)
- [ ] T115 [P] Implement useOnlineStatus hook in frontend/src/hooks/useOnlineStatus.ts (show offline indicator)
- [ ] T116 [P] Add offline indicator to App.tsx (subtle banner when offline)
- [ ] T117 [P] Create TimerSettings component in frontend/src/components/Settings/TimerSettings.tsx (configure focus/break duration)
- [ ] T118 [P] Integrate TimerSettings into SettingsModal
- [ ] T119 [P] Add visual feedback for all interactive elements (hover states, focus rings for accessibility)
- [ ] T120 [P] Verify WCAG 2.1 AA compliance (contrast ratios, keyboard navigation)
- [ ] T121 [P] Add loading states for all async operations (skeleton screens, spinners)
- [ ] T122 [P] Implement toast notifications for user feedback (success, error messages)
- [ ] T123 Performance optimization: lazy load routes in App.tsx (React.lazy)
- [ ] T124 [P] Add favicon and meta tags to frontend/index.html
- [ ] T125 [P] Update README.md with quickstart instructions (reference quickstart.md)
- [ ] T126 Run full validation per quickstart.md (setup backend, frontend, verify all features work)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 6 (Phase 3)**: Depends on Foundational - Provides UI foundation for US1
- **User Story 1 (Phase 4)**: Depends on Foundational + US6 - Core MVP
- **User Stories 2-5 (Phase 5-8)**: All depend on Foundational + US6 completion
  - Can proceed in parallel (if team capacity allows)
  - Or sequentially in priority order (US2 → US3 → US4 → US5)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 6 (P1)**: Foundational only → Provides UI/UX foundation
- **User Story 1 (P1)**: Foundational + US6 → Core timer feature (MVP)
- **User Story 2 (P2)**: Foundational + US6 → Independent (can run parallel to US3/4/5 after MVP)
- **User Story 3 (P2)**: Foundational + US6 + US1 (needs Task model) → Extends task management
- **User Story 4 (P3)**: Foundational + US6 + US1 + US3 → Reuses components from US1/US3
- **User Story 5 (P3)**: Foundational + US6 → Independent (can run parallel to US2/3/4)

### Critical Path for MVP

1. Setup (Phase 1) → T001-T008
2. Foundational (Phase 2) → T009-T022
3. User Story 6 (Phase 3) → T023-T032 (UI foundation)
4. User Story 1 (Phase 4) → T033-T058 (MVP core)
5. **STOP**: MVP is now complete and testable

### Parallel Opportunities

**After Foundational Phase (T022) completes:**

- User Story 6 (UI foundation) and User Story 5 (habits) can run in parallel (different domains)
- User Story 2 (brain dump) can run parallel to User Story 3 (micro-steps) after US1 MVP

**Within Each User Story:**

- All tasks marked [P] can run in parallel
- Backend models can be built in parallel with frontend components (different files)
- Multiple developers can work on different user stories simultaneously

---

## Parallel Example: User Story 1 (MVP Core)

**Backend team can work in parallel:**
```bash
# Launch together (different files):
T033: Create Task model (backend/src/models/task.py)
T034: Create PomodoroSession model (backend/src/models/pomodoro.py)
T035: Task Pydantic schemas (backend/src/schemas/task.py)
T036: Pomodoro Pydantic schemas (backend/src/schemas/pomodoro.py)
```

**Frontend team can work in parallel:**
```bash
# Launch together (different files):
T042: useTimer hook (frontend/src/hooks/useTimer.ts)
T043: audioUtils (frontend/src/utils/audioUtils.ts)
T045: Task types (frontend/src/types/task.ts)
T046: Pomodoro types (frontend/src/types/pomodoro.ts)
T051: CircularTimer component (frontend/src/components/Timer/CircularTimer.tsx)
T052: TimerDisplay component (frontend/src/components/Timer/TimerDisplay.tsx)
T053: TimerControls component (frontend/src/components/Timer/TimerControls.tsx)
T054: TaskInput component (frontend/src/components/Tasks/TaskInput.tsx)
```

---

## Implementation Strategy

### MVP First (User Stories 6 + 1 Only)

**Goal**: Get core focus timer working in ADHD-friendly UI

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T022) - CRITICAL CHECKPOINT
3. Complete Phase 3: User Story 6 (T023-T032) - UI foundation
4. Complete Phase 4: User Story 1 (T033-T058) - Timer MVP
5. **STOP and VALIDATE**: Test end-to-end (create task, start timer, complete session, hear audio, restore state)
6. Deploy/demo if ready

**Estimated Task Count**: 58 tasks for MVP

### Incremental Delivery (Recommended)

After MVP, add features incrementally:

1. **Foundation** (T001-T022) → Backend + Frontend infrastructure ready
2. **MVP** (T023-T058) → US6 UI + US1 Timer working → Deploy!
3. **+Brain Dump** (T059-T072) → Add US2 → Deploy!
4. **+Micro-Steps** (T073-T091) → Add US3 → Deploy!
5. **+Task List** (T092-T098) → Add US4 → Deploy!
6. **+Habits** (T099-T113) → Add US5 → Deploy!
7. **Polish** (T114-T126) → Final refinements → Deploy!

Each increment adds value without breaking previous features.

### Parallel Team Strategy

With multiple developers (after Foundational phase):

**Team A**: US6 (UI foundation) → US1 (Timer) → MVP done
**Team B**: US5 (Habits) → standalone feature
**Team C**: US2 (Brain Dump) → integrates with US1

Once MVP done, teams can work on US2/3/4 in parallel.

---

## Task Summary

**Total Tasks**: 126
- Setup: 8 tasks
- Foundational: 14 tasks
- User Story 6 (UI): 10 tasks
- User Story 1 (MVP): 26 tasks
- User Story 2: 14 tasks
- User Story 3: 19 tasks
- User Story 4: 7 tasks
- User Story 5: 15 tasks
- Polish: 13 tasks

**MVP Tasks**: 58 tasks (Setup + Foundational + US6 + US1)

**Parallel Opportunities**: 70+ tasks marked [P] can run in parallel

**Independent Test Criteria**:
- **US6**: Visual inspection of immersive mode, themes, animations
- **US1**: Create task → Start timer → Complete 25min → Hear audio → Restore after refresh
- **US2**: Capture thought during focus → Review inbox → Convert to task
- **US3**: Create task → Add micro-steps → Drag reorder → Complete (animation + audio) → Auto-complete parent
- **US4**: Quick add tasks with keyboard → Verify persistence
- **US5**: Create habit → Check in → Verify streak → Skip day → Verify reset

**Suggested MVP Scope**: User Stories 6 + 1 (58 tasks)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are absolute based on plan.md structure (backend/src/, frontend/src/)
- Tests are NOT included in this task list (spec.md doesn't request TDD approach)
- Focus on implementation tasks that deliver user value per acceptance scenarios
