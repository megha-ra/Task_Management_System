##AI-compatible goal-to-task suggestion service with an offline fallback."""

import json
import os
from urllib import request

from ..schemas import SuggestionResponse


def fallback_suggestions(goal: str) -> list[SuggestionResponse]:
    ## Generate useful local suggestions so the project works without an API key.
    clean_goal = goal.strip().rstrip(".")
    return [
        SuggestionResponse(title=f"Define the outcome for {clean_goal}", description="Write a clear, realistic definition of done and a deadline.", priority="High", category="Planning"),
        SuggestionResponse(title="Break the goal into small steps", description=f"List the next practical actions needed to make progress on: {clean_goal}.", priority="High", category="Planning"),
        SuggestionResponse(title="Schedule a focused work session", description="Block 45–60 minutes for the first important step and remove distractions.", priority="Medium", category="Focus"),
        SuggestionResponse(title="Gather required materials", description="Prepare the notes, links, tools, or people you need before starting.", priority="Medium", category="Preparation"),
    ]


def provider_suggestions(goal: str) -> list[SuggestionResponse] | None:
    ## Call an OpenAI-compatible provider when the optional API key is configured."""
    api_key = os.getenv("AI_API_KEY")
    if not api_key:
        return None
    base_url = os.getenv("AI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.getenv("AI_MODEL", "gpt-4o-mini")
    prompt = f"Return JSON only: an array of 3 to 5 practical task objects with title, description, priority (Low/Medium/High), category. Goal: {goal}"
    payload = json.dumps({"model": model, "messages": [{"role": "user", "content": prompt}], "temperature": 0.5}).encode()
    try:
        http_request = request.Request(f"{base_url}/chat/completions", data=payload, headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"})
        with request.urlopen(http_request, timeout=12) as response:
            content = json.loads(response.read())["choices"][0]["message"]["content"]
        parsed = json.loads(content.replace("```json", "").replace("```", "").strip())
        return [SuggestionResponse(**item) for item in parsed[:5]]
    except (OSError, KeyError, IndexError, TypeError, ValueError, json.JSONDecodeError):
        return None


def suggest_tasks(goal: str) -> list[SuggestionResponse]:
    ## Return provider-generated suggestions when possible, otherwise use local rules.
    return provider_suggestions(goal) or fallback_suggestions(goal)
