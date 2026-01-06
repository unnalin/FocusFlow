@echo off
echo ========================================
echo Testing Task Deletion Features
echo ========================================
echo.

echo This will test two features:
echo 1. Auto-delete task after completing focus session
echo 2. Manual delete button (hover to show)
echo.

echo Step 1: Starting frontend dev server...
echo.
cd frontend
start cmd /k "npm run dev"

echo.
echo Waiting for server to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Frontend started!
echo ========================================
echo.
echo Open your browser to: http://localhost:5173/
echo.
echo Test Manual Delete:
echo   1. Create a few tasks
echo   2. Hover mouse over any task
echo   3. Click the trash icon on the right
echo   4. Task should disappear immediately
echo.
echo Test Auto-Delete:
echo   1. Create a task
echo   2. Select it (click on it)
echo   3. Start focus session
echo   4. Wait for completion (25 minutes)
echo   5. Task should auto-delete when session completes
echo.
echo Note: To speed up testing, you can temporarily change
echo       the duration to 1 minute in the code.
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:5173/

echo.
echo Browser opened! Start testing.
echo.
echo Close the CMD window when done testing.
pause
