from fastapi import Depends, Header, HTTPException, status

from .models import Role
from .schemas import TokenPayload
from .security import decode_token


def _extract_token(auth_header: str | None) -> str:
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return auth_header.split(" ", 1)[1]


def get_current_user(authorization: str | None = Header(default=None)) -> TokenPayload:
    token = _extract_token(authorization)
    try:
        payload = decode_token(token)
        return TokenPayload(**payload)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from None


def require_admin(user: TokenPayload = Depends(get_current_user)) -> TokenPayload:
    if user.role != Role.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return user
