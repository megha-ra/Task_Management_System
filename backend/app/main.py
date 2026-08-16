"""FastAPI application entry point."""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine, test_db_connection
from .routers import ai, auth, tasks


def create_application() -> FastAPI:
    """Create and configure the Task Management API."""
    test_db_connection()

    Base.metadata.create_all(bind=engine)
    application = FastAPI(
        title="Task Management API",
        description="JWT-protected task management with dashboard statistics and AI task suggestions.",
        version="1.0.0",
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    application.include_router(auth.router)
    application.include_router(tasks.router)
    application.include_router(ai.router)
    return application


app = create_application()
