"""
Optional auth: get user_id from Supabase JWT in Authorization header.
Used for /api/requests (create/list by user).
"""
import os
from typing import Optional

import requests
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env")

scheme = HTTPBearer(auto_error=False)


def get_user_id_from_token(credentials: Optional[HTTPAuthorizationCredentials] = Security(scheme)) -> Optional[str]:
    """
    Validate Supabase access token by calling Auth API and return user id, or None if invalid.
    """
    if not credentials:
        return None
    token = credentials.credentials
    try:
        resp = requests.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "apikey": SUPABASE_SERVICE_ROLE_KEY,
                "Authorization": f"Bearer {token}",
            },
            timeout=5,
        )
        if resp.status_code != 200:
            return None
        data = resp.json()
        # Supabase user object has "id" as the user identifier
        return data.get("id")
    except Exception:
        return None


def require_user_id(credentials: Optional[HTTPAuthorizationCredentials] = Security(scheme)) -> str:
    """Require valid Supabase JWT; return user_id or raise 401."""
    user_id = get_user_id_from_token(credentials)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or missing authorization token")
    return user_id
