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

# Configure engine parameters
if is_sqlite:
    # SQLite configuration for local development
    engine_kwargs = {
        "poolclass": NullPool,
        "connect_args": {"check_same_thread": False},
    }
else:
    # PostgreSQL configuration for production (Render/PgBouncer)
    engine_kwargs = {
        # 核心修改 1: 必须使用 NullPool。
        # 当后端连接 PgBouncer 时，SQLAlchemy 内部不能再维护连接池，否则会导致状态冲突。
        "poolclass": NullPool, 
        
        "pool_pre_ping": True,
        "connect_args": {
            # 核心修改 2: 禁用驱动层面的预处理语句缓存。
            # 这两个参数必须放在 connect_args 内部。
            "statement_cache_size": 0,
            "prepared_statement_cache_size": 0,
            "server_settings": {
                "application_name": "focusflow_backend",
                "jit": "off"
            }
        }
    }

# Create async engine
# 核心修改 3: 移除了之前错误的 execution_options 传参。
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
            # 注意：在 FastAPI 依赖中，通常不需要在这里手动 commit
            # 但如果你习惯在这里 commit 也可以保留
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