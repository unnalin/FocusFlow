@echo off
REM Quick API connectivity test
echo Testing API connectivity...
echo.

echo [1] Testing backend health endpoint...
curl -s http://localhost:8000/api/v1/health
if %errorlevel% equ 0 (
    echo.
    echo SUCCESS: Backend is responding
) else (
    echo.
    echo ERROR: Backend is not responding
    echo Make sure backend is running on http://localhost:8000
)
echo.

echo [2] Testing API documentation...
echo Open in browser: http://localhost:8000/docs
echo.

pause
