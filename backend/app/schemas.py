## Pydantic validation schemas shared by API routes.

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

TaskStatus = Literal["Pending", "Completed"]
TaskPriority = Literal["Low", "Medium", "High"]


class UserRegister(BaseModel):
    ## Payload accepted when a user creates an account.

    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    ## Payload accepted when a user signs in.

    email: EmailStr
    password: str = Field(min_length=1)


class UserResponse(BaseModel):
    ## Public representation of a user.

    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: EmailStr
    created_at: datetime


class TokenResponse(BaseModel):
    ## JWT response returned after authentication.

    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TaskBase(BaseModel):
    ## Fields shared by create and update task payloads.

    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    status: TaskStatus = "Pending"
    priority: TaskPriority = "Medium"
    category: str | None = Field(default=None, max_length=100)
    due_date: date | None = None


class TaskCreate(TaskBase):
    """Payload for creating a task."""


class TaskUpdate(TaskBase):
    """Payload for replacing editable task fields."""


class TaskStatusUpdate(BaseModel):
    """Payload for quickly changing a task status."""

    status: TaskStatus


class TaskResponse(TaskBase):
    """Task data returned to the frontend."""

    model_config = ConfigDict(from_attributes=True)
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime


class DashboardStats(BaseModel):
    """Summary counts for a user's dashboard."""

    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int
    completion_percentage: float


class SuggestionRequest(BaseModel):
    """Goal entered by a user for AI task suggestions."""

    goal: str = Field(min_length=3, max_length=500)


class SuggestionResponse(BaseModel):
    """A generated practical task suggestion."""

    title: str
    description: str
    priority: TaskPriority = "Medium"
    category: str = "Suggested"
