@echo off
echo Starting FocusFlow Frontend Dev Server...
echo.

cd frontend

echo Installing dependencies (if needed)...
call npm install

echo.
echo Starting dev server...
echo Frontend: http://localhost:5173/
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
