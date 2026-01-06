@echo off
echo Starting FocusFlow Backend Server...
echo.

cd backend

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo.
echo Starting server on http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo Health Check: http://localhost:8000/api/v1/health
echo.
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
