##Authenticated task CRUD and dashboard endpoints.

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models import Task, User
from ..schemas import DashboardStats, TaskCreate, TaskPriority, TaskResponse, TaskStatus, TaskStatusUpdate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks"])


def get_owned_task(task_id: int, user_id: int, db: Session) -> Task:
    ##Return a task only when it belongs to the requesting user.
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user_id).first()
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.get("/stats/dashboard", response_model=DashboardStats, summary="Get dashboard task statistics")
def dashboard_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ##Calculate the requesting user's task totals and completion rate.

    tasks = db.query(Task).filter(Task.owner_id == current_user.id).all()
    total = len(tasks)
    completed = sum(task.status == "Completed" for task in tasks)
    overdue = sum(task.status != "Completed" and task.due_date is not None and task.due_date < date.today() for task in tasks)
    return DashboardStats(
        total_tasks=total,
        completed_tasks=completed,
        pending_tasks=total - completed,
        overdue_tasks=overdue,
        completion_percentage=round((completed / total * 100) if total else 0, 1),
    )


@router.get("", response_model=list[TaskResponse], summary="List the current user's tasks")
def list_tasks(
    search: str | None = Query(default=None, description="Search title and description"),
    status_filter: TaskStatus | None = Query(default=None, alias="status"),
    priority: TaskPriority | None = Query(default=None),
    category: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ##List tasks owned by the user with optional search and filters.
    query = db.query(Task).filter(Task.owner_id == current_user.id)
    if search:
        term = f"%{search.strip()}%"
        query = query.filter(or_(Task.title.ilike(term), Task.description.ilike(term)))
    if status_filter:
        query = query.filter(Task.status == status_filter)
    if priority:
        query = query.filter(Task.priority == priority)
    if category:
        query = query.filter(Task.category == category)
    return query.order_by(Task.created_at.desc()).all()


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, summary="Create a task")
def create_task(payload: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ##Create a new task owned by the authenticated user.
    task = Task(**payload.model_dump(), owner_id=current_user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskResponse, summary="Get one task")
def read_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Return one of the requesting user's tasks."""
    return get_owned_task(task_id, current_user.id, db)


@router.put("/{task_id}", response_model=TaskResponse, summary="Update a task")
def update_task(task_id: int, payload: TaskUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Replace the editable fields of a task owned by the requester."""
    task = get_owned_task(task_id, current_user.id, db)
    for field, value in payload.model_dump().items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@router.patch("/{task_id}/status", response_model=TaskResponse, summary="Change task status")
def update_task_status(task_id: int, payload: TaskStatusUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Change only the status of an owned task."""
    task = get_owned_task(task_id, current_user.id, db)
    task.status = payload.status
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a task")
def delete_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Permanently delete a task owned by the requester."""
    task = get_owned_task(task_id, current_user.id, db)
    db.delete(task)
    db.commit()
