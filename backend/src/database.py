"""Database configuration and session management."""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool
from sqlalchemy import text
from typing import AsyncGenerator
import os
from dotenv import load_dotenv

load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./focusflow.db")

# Handle Render's DATABASE_URL format
# Render uses postgres:// but we need postgresql+psycopg:// for async psycopg3
if DATABASE_URL.startswith("postgres://"):
    # Strip any query params first
    if "?" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.split("?")[0]
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    # Strip any query params first
    if "?" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.split("?")[0]
    # Only add +psycopg if no driver specified
    if "+psycopg" not in DATABASE_URL and "+asyncpg" not in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

# Determine if using SQLite or PostgreSQL
is_sqlite = "sqlite" in DATABASE_URL.lower()

# Configure engine parameters
if is_sqlite:
    # SQLite configuration for local development
    engine_kwargs = {
        "poolclass": NullPool,
        "connect_args": {"check_same_thread": False},
    }
else:
    # PostgreSQL configuration with psycopg3
    # psycopg3 works well with PgBouncer out of the box
    engine_kwargs = {
        "pool_size": 20,
        "max_overflow": 10,
        "pool_pre_ping": True,
        "pool_recycle": 3600,
        "connect_args": {
            "server_settings": {
                "application_name": "focusflow_backend",
            },
            # psycopg3 automatically handles SSL based on server requirements
            "autocommit": False,
        }
    }

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True if os.getenv("ENVIRONMENT") == "development" else False,
    **engine_kwargs
)

# Configure session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class for models
Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for getting async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Initialize database. Applies SQLite optimizations if using SQLite."""
    async with engine.begin() as conn:
        # Enable WAL mode for better concurrency (SQLite only)
        if is_sqlite:
            await conn.execute(text("PRAGMA journal_mode=WAL"))
            await conn.execute(text("PRAGMA synchronous=NORMAL"))
            await conn.execute(text("PRAGMA cache_size=-64000"))

        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
