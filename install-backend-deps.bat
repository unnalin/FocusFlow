@echo off
echo Installing backend dependencies...
echo.

cd backend

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo.
echo Installing asyncpg and other dependencies...
python -m pip install -r requirements.txt

echo.
echo Verifying installation...
python -c "import asyncpg; print('asyncpg installed successfully, version:', asyncpg.__version__)"

echo.
echo Installation complete!
echo.
echo You can now start the backend server with:
echo   cd backend
echo   .venv\Scripts\activate
echo   python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
echo.

pause
