from datetime import datetime, timedelta, timezone
from typing import Any, Dict

from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import settings
from .models import Role

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 8

# Allow passwords >72 chars by truncating instead of raising, to keep API ergonomic.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__truncate_error=False)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_access_token(data: Dict[str, Any]) -> str:
    to_encode = {key: (value.value if isinstance(value, Role) else value) for key, value in data.items()}
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=ALGORITHM)


def decode_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
        return payload
    except JWTError as exc:
        raise ValueError("Invalid token") from exc


def serialize_user(user: Any) -> Dict[str, Any]:
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "name": user.name,
    }
