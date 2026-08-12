## Password hashing, password verification, and JWT token generation.

import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv
from jose import jwt
from passlib.context import CryptContext

# Find the backend directory
BASE_DIR = Path(__file__).resolve().parents[2]

# Load backend/.env
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    ## Hash a plain-text password before storing it."""
    return password_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    ## Return whether a plain-text password matches its stored hash."""
    return password_context.verify(plain_password, hashed_password)


def create_access_token(subject: str) -> str:
    ## Create a signed, time-limited JWT for a user identifier."""
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": subject, "exp": expires_at}, SECRET_KEY, algorithm=ALGORITHM)
