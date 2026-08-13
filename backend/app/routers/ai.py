## AI task suggestion API endpoint.

from fastapi import APIRouter, Depends

from ..dependencies import get_current_user
from ..models import User
from ..schemas import SuggestionRequest, SuggestionResponse
from ..services.ai_services import suggest_tasks

router = APIRouter(prefix="/ai", tags=["AI Suggestions"])


@router.post("/suggest-tasks", response_model=list[SuggestionResponse], summary="Suggest practical tasks for a goal")
def create_suggestions(payload: SuggestionRequest, current_user: User = Depends(get_current_user)):
    ## Return 3–5 task ideas for an authenticated user's stated goal.
    return suggest_tasks(payload.goal)
