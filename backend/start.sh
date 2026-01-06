#!/usr/bin/env bash
# Render startup script for FocusFlow backend

# Exit on error
set -e

echo "Starting FocusFlow backend..."

# Set PYTHONPATH to include the backend directory
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Print environment info
echo "Python version: $(python --version)"
echo "PYTHONPATH: $PYTHONPATH"
echo "Current directory: $(pwd)"

# Run database migrations if needed (uncomment when using Alembic)
# echo "Running database migrations..."
# alembic upgrade head

# Start the application
echo "Starting uvicorn server..."
exec uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}
