from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from .models import Role


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class TokenPayload(BaseModel):
    id: int
    email: EmailStr
    role: Role
    name: str


class TokenResponse(BaseModel):
    token: str
    user: TokenPayload


class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(min_length=2)
    password: str = Field(min_length=6)
    role: Role


class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: Role
    createdAt: datetime

    class Config:
        from_attributes = True


class UserList(BaseModel):
    users: list[UserOut]


class UpdateRoleRequest(BaseModel):
    role: Role


class HealthResponse(BaseModel):
    status: str
    db: Optional[str] = None
