# """Database configuration and session management."""
# from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
# from sqlalchemy.orm import declarative_base
# from sqlalchemy.pool import NullPool
# from sqlalchemy import text
# import os
# from dotenv import load_dotenv

# load_dotenv()

# DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./focusflow.db")

# # Determine if using SQLite or PostgreSQL
# is_sqlite = "sqlite" in DATABASE_URL.lower()

# # Configure engine parameters based on database type
# if is_sqlite:
#     # SQLite configuration for local development
#     engine_kwargs = {
#         "poolclass": NullPool,  # SQLite doesn't benefit from connection pooling
#         "connect_args": {"check_same_thread": False},
#     }
# else:
#     # PostgreSQL configuration for production
#     # Disable prepared statements for PgBouncer compatibility (used by Render)
#     engine_kwargs = {
#         "pool_size": 20,  # Maximum number of connections in the pool
#         "max_overflow": 10,  # Maximum number of connections that can be created beyond pool_size
#         "pool_pre_ping": True,  # Verify connections before using them
#         "pool_recycle": 3600,  # Recycle connections after 1 hour
#         "connect_args": {
#             "statement_cache_size": 0,  # Disable prepared statements for PgBouncer
#             "prepared_statement_cache_size": 0,  # Also disable this cache
#             "server_settings": {
#                 "application_name": "focusflow_backend",
#                 "jit": "off"  # Disable JIT for PgBouncer
#             }
#         }
#     }

# # Create async engine
# # For asyncpg, we need to pass prepare_threshold=0 to disable prepared statements
# if not is_sqlite:
#     # Use execution options to disable prepared statements globally
#     engine = create_async_engine(
#         DATABASE_URL,
#         echo=True if os.getenv("ENVIRONMENT") == "development" else False,
#         execution_options={
#             "prepared_statement_cache_size": 0
#         },
#         **engine_kwargs
#     )
# else:
#     engine = create_async_engine(
#         DATABASE_URL,
#         echo=True if os.getenv("ENVIRONMENT") == "development" else False,
#         **engine_kwargs
#     )

# # Configure session factory
# AsyncSessionLocal = async_sessionmaker(
#     engine,
#     class_=AsyncSession,
#     expire_on_commit=False,
#     autocommit=False,
#     autoflush=False,
# )

# # Base class for models
# Base = declarative_base()


# async def get_db() -> AsyncSession:
#     """Dependency for getting async database session."""
#     async with AsyncSessionLocal() as session:
#         try:
#             yield session
#             await session.commit()
#         except Exception:
#             await session.rollback()
#             raise
#         finally:
#             await session.close()


# async def init_db():
#     """Initialize database. Applies SQLite optimizations if using SQLite."""
#     async with engine.begin() as conn:
#         # Enable WAL mode for better concurrency (SQLite only)
#         if is_sqlite:
#             await conn.execute(text("PRAGMA journal_mode=WAL"))
#             await conn.execute(text("PRAGMA synchronous=NORMAL"))
#             await conn.execute(text("PRAGMA cache_size=-64000"))  # 64MB cache

#         # Create all tables
#         await conn.run_sync(Base.metadata.create_all)

"""Database configuration and session management."""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.pool import NullPool
from typing import Generator
import os
from dotenv import load_dotenv

load_dotenv()

# Convert async database URLs to sync versions
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./focusflow.db")

# Convert asyncpg/aiosqlite URLs to sync versions
if "postgresql+asyncpg://" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql+psycopg2://")
elif "sqlite+aiosqlite://" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("sqlite+aiosqlite://", "sqlite://")

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
    # PostgreSQL configuration for production
    # psycopg2 works well with PgBouncer, no special configuration needed
    engine_kwargs = {
        "pool_size": 20,
        "max_overflow": 10,
        "pool_pre_ping": True,
        "pool_recycle": 3600,
    }

# Create sync engine
engine = create_engine(
    DATABASE_URL,
    echo=True if os.getenv("ENVIRONMENT") == "development" else False,
    **engine_kwargs
)

# Configure session factory
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

# Base class for models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency for getting database session."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db():
    """Initialize database. Applies SQLite optimizations if using SQLite."""
    with engine.begin() as conn:
        # Enable WAL mode for better concurrency (SQLite only)
        if is_sqlite:
            conn.execute(text("PRAGMA journal_mode=WAL"))
            conn.execute(text("PRAGMA synchronous=NORMAL"))
            conn.execute(text("PRAGMA cache_size=-64000"))

        # Create all tables
        Base.metadata.create_all(bind=engine)