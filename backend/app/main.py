from fastapi import FastAPI
from .database import test_db_connection


app = FastAPI(title="Task Management API")
test_db_connection()

@app.get("/")
def root():
    return {"message": "Task Management API"}