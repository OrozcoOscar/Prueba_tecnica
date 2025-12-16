from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .config import settings
from .models import Role, User
from .security import hash_password


def create_user(session: Session, *, email: str, name: str, password: str, role: Role) -> User:
    password_hash = hash_password(password)
    user = User(email=email, name=name, passwordHash=password_hash, role=role)
    session.add(user)
    try:
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists") from exc
    session.refresh(user)
    return user


def find_by_email(session: Session, email: str) -> User | None:
    return session.scalar(select(User).where(User.email == email))


def list_users(session: Session) -> list[User]:
    stmt = select(User).order_by(User.createdAt.desc())
    return list(session.scalars(stmt).all())


def update_user_role(session: Session, user_id: int, role: Role) -> User:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.role = role
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def ensure_admin_user(session: Session) -> User:
    existing = find_by_email(session, settings.admin_email)
    if existing:
        return existing

    password_hash = hash_password(settings.admin_password)
    admin = User(
        email=settings.admin_email,
        name=settings.admin_name,
        passwordHash=password_hash,
        role=Role.ADMIN,
    )
    session.add(admin)
    session.commit()
    session.refresh(admin)
    return admin
