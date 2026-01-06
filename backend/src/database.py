"""Database configuration and session management."""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./focusflow.db")

# Determine if using SQLite or PostgreSQL
is_sqlite = "sqlite" in DATABASE_URL.lower()

# Configure engine parameters based on database type
if is_sqlite:
    # SQLite configuration for local development
    engine_kwargs = {
        "poolclass": NullPool,  # SQLite doesn't benefit from connection pooling
        "connect_args": {"check_same_thread": False},
    }
else:
    # PostgreSQL configuration for production
    engine_kwargs = {
        "pool_size": 20,  # Maximum number of connections in the pool
        "max_overflow": 10,  # Maximum number of connections that can be created beyond pool_size
        "pool_pre_ping": True,  # Verify connections before using them
        "pool_recycle": 3600,  # Recycle connections after 1 hour
        "connect_args": {
            "server_settings": {
                "application_name": "focusflow_backend"
            }
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


async def get_db() -> AsyncSession:
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
            await conn.execute(text("PRAGMA cache_size=-64000"))  # 64MB cache

        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
