@echo off
REM Quick test script for deployment configuration
REM Run this from the project root directory

echo ========================================
echo FocusFlow Deployment Configuration Test
echo ========================================
echo.

echo [1/5] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    exit /b 1
)
python --version
echo.

echo [2/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    exit /b 1
)
node --version
npm --version
echo.

echo [3/5] Checking backend dependencies...
if not exist "backend\.venv" (
    echo WARNING: Virtual environment not found
    echo Please run: cd backend ^&^& python -m venv .venv
) else (
    echo Virtual environment found: backend\.venv
)
if exist "backend\requirements.txt" (
    echo requirements.txt found
    findstr "asyncpg" backend\requirements.txt >nul
    if %errorlevel% equ 0 (
        echo   - asyncpg: FOUND
    ) else (
        echo   - asyncpg: MISSING
    )
) else (
    echo ERROR: backend\requirements.txt not found
)
echo.

echo [4/5] Checking backend configuration...
if exist "backend\.env" (
    echo backend\.env found
    findstr "DATABASE_URL" backend\.env >nul
    if %errorlevel% equ 0 (
        echo   - DATABASE_URL: SET
    ) else (
        echo   - DATABASE_URL: NOT SET
    )
    findstr "ALLOWED_ORIGINS" backend\.env >nul
    if %errorlevel% equ 0 (
        echo   - ALLOWED_ORIGINS: SET
    ) else (
        echo   - ALLOWED_ORIGINS: NOT SET
    )
) else (
    echo WARNING: backend\.env not found
    echo Please copy backend\.env.example to backend\.env
)
echo.

echo [5/5] Checking frontend configuration...
if exist "frontend\.env" (
    echo frontend\.env found
    findstr "VITE_API_URL" frontend\.env >nul
    if %errorlevel% equ 0 (
        echo   - VITE_API_URL: SET
    ) else (
        echo   - VITE_API_URL: NOT SET
    )
) else (
    echo WARNING: frontend\.env not found
    echo Please copy frontend\.env.example to frontend\.env
)
if exist "frontend\package.json" (
    echo package.json found
) else (
    echo ERROR: frontend\package.json not found
)
echo.

echo ========================================
echo Test Summary
echo ========================================
echo.
echo Next steps:
echo 1. Activate virtual environment:
echo    cd backend ^&^& .venv\Scripts\activate
echo.
echo 2. Install backend dependencies:
echo    pip install -r requirements.txt
echo.
echo 3. Start backend server:
echo    python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
echo.
echo 4. In a new terminal, install frontend dependencies:
echo    cd frontend ^&^& npm install
echo.
echo 5. Start frontend dev server:
echo    npm run dev
echo.
echo 6. Open browser to http://localhost:5173/
echo.
echo For detailed testing instructions, see TEST_DEPLOYMENT.md
echo.

pause
