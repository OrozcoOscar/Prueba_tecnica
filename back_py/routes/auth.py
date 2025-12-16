from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..schemas import LoginRequest, TokenPayload, TokenResponse
from ..security import create_access_token, serialize_user, verify_password
from ..services import find_by_email

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = find_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not verify_password(payload.password, user.passwordHash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token_payload = TokenPayload(id=user.id, email=user.email, role=user.role, name=user.name)
    token = create_access_token(token_payload.model_dump(mode="json"))
    return {"token": token, "user": serialize_user(user)}
