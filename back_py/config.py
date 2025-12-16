import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


def _require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required env var: {name}")
    return value


def _get_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    try:
        return int(raw) if raw is not None else default
    except ValueError:
        raise RuntimeError(f"Environment variable {name} must be an integer") from None


@dataclass
class Settings:
    database_url: str
    jwt_secret: str
    port: int
    admin_email: str
    admin_password: str
    admin_name: str


settings = Settings(
    database_url=_require_env("DATABASE_URL"),
    jwt_secret=_require_env("JWT_SECRET"),
    port=_get_int("PORT", 4000),
    admin_email=os.getenv("ADMIN_EMAIL", "admin@empresa.com"),
    admin_password=os.getenv("ADMIN_PASSWORD", "admin123"),
    admin_name=os.getenv("ADMIN_NAME", "Administrador"),
)
