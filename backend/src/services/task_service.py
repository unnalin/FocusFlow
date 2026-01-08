"""Task service for managing tasks."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from src.models.task import Task
from src.schemas.task import TaskCreate, TaskUpdate
from typing import List, Optional


async def create_task(db: AsyncSession, task_data: TaskCreate) -> Task:
    """Create a new task."""
    # Get the highest order value
    result = await db.execute(select(Task).order_by(desc(Task.order)).limit(1))
    last_task = result.scalar_one_or_none()
    next_order = (last_task.order + 1) if last_task else 0

    task = Task(**task_data.model_dump(), order=next_order)
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


async def get_task(db: AsyncSession, task_id: int) -> Optional[Task]:
    """Get a task by ID."""
    result = await db.execute(select(Task).where(Task.id == task_id))
    return result.scalar_one_or_none()


async def list_tasks(db: AsyncSession, include_completed: bool = True) -> List[Task]:
    """List all tasks."""
    query = select(Task).order_by(Task.order, Task.created_at)
    if not include_completed:
        query = query.where(Task.completed == False)

    result = await db.execute(query)
    return list(result.scalars().all())


async def update_task(db: AsyncSession, task_id: int, task_update: TaskUpdate) -> Optional[Task]:
    """Update a task."""
    task = await get_task(db, task_id)
    if not task:
        return None

    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    await db.commit()
    await db.refresh(task)
    return task


async def delete_task(db: AsyncSession, task_id: int) -> bool:
    """Delete a task."""
    task = await get_task(db, task_id)
    if not task:
        return False

    await db.delete(task)
    await db.commit()
    return True
