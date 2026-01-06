"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title=os.getenv("PROJECT_NAME", "FocusFlow"),
    version="0.1.0",
    description="ADHD-friendly focus and productivity tool",
)

# CORS middleware configuration
origins = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    from src.database import init_db
    await init_db()


@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "FocusFlow API",
        "version": "0.1.0"
    }


# Include routers
from src.routers import settings, tasks, pomodoro
app.include_router(settings.router, prefix="/api/v1")
app.include_router(tasks.router, prefix="/api/v1")
app.include_router(pomodoro.router, prefix="/api/v1")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
