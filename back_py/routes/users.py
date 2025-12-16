from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import require_admin
from ..models import Role
from ..schemas import TokenPayload, UpdateRoleRequest, UserCreate, UserOut
from ..services import create_user, list_users, update_user_role

router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(require_admin)])


@router.get("/", response_model=list[UserOut])
def get_users(db: Session = Depends(get_db)):
    return list_users(db)


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user_handler(payload: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, email=payload.email, name=payload.name, password=payload.password, role=payload.role)


@router.patch("/{user_id}/role", response_model=UserOut)
def update_role(user_id: int, payload: UpdateRoleRequest, db: Session = Depends(get_db)):
    if user_id <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id")
    return update_user_role(db, user_id=user_id, role=payload.role)
