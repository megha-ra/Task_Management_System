from fastapi import FastAPI

from .routers.auth import router as auth_router

app = FastAPI(
    title="Task Management System",
    version="1.0.0",
)

app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "Task Management System API is running"
    }