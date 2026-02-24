from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from supabase_client import supabase
from typing import List, Optional
from fastapi import Query

from utils import normalize_domain, is_shopify_html, is_shopify_by_cart_js
from auth import get_user_id_from_token, require_user_id

app = FastAPI(title="Discountly API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InspectRequest(BaseModel):
    url: str


class InspectResponse(BaseModel):
    store_id: str
    domain: str
    is_shopify: bool

class CouponsResponse(BaseModel):
    domain: str
    is_shopify: bool
    coupons: List[str]


class StoreItem(BaseModel):
    id: str
    domain: str
    is_shopify: bool


class StoresResponse(BaseModel):
    stores: List[StoreItem]


class CreateRequestPayload(BaseModel):
    domain: str
    email: Optional[str] = None


class RequestItem(BaseModel):
    id: str
    store_id: str
    domain: str
    status: str
    created_at: str
    coupons: List[str] = []


class RequestsResponse(BaseModel):
    requests: List[RequestItem]


class SaveCodePayload(BaseModel):
    domain: str
    code: str


class SavedCodeItem(BaseModel):
    id: str
    store_id: str
    domain: str
    code: str
    created_at: str


class SavedCodesResponse(BaseModel):
    codes: List[SavedCodeItem]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/store/inspect", response_model=InspectResponse)
def inspect_store(payload: InspectRequest):
    # 1) Normalize domain
    try:
        domain = normalize_domain(payload.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    headers = {"User-Agent": "Mozilla/5.0 (compatible; DiscountlyBot/0.1)"}

    # 2) Fast path: try /cart.js to detect Shopify
    shopify = False
    try:
        cart_resp = requests.get(f"https://{domain}/cart.js", timeout=6, headers=headers)
        if cart_resp.status_code == 200:
            if is_shopify_by_cart_js(cart_resp.text, cart_resp.headers.get("Content-Type", "")):
                shopify = True
    except requests.RequestException:
        pass  # fall back to HTML method

    # 3) If not detected via cart.js, fetch homepage HTML and use pattern detection
    if not shopify:
        html = ""
        try:
            home_resp = requests.get(f"https://{domain}", timeout=8, headers=headers)
            if home_resp.status_code < 500:
                html = home_resp.text
        except requests.RequestException:
            html = ""
        shopify = is_shopify_html(html)

    # 4) Upsert store in Supabase (by unique domain)
    try:
        res = (
            supabase.table("stores")
            .upsert(
                {"domain": domain, "is_shopify": shopify},
                on_conflict="domain"
            )
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase error: {e}")

    # Supabase returns inserted/updated rows in res.data
    if not res.data or len(res.data) == 0:
        # If this happens, something is wrong with permissions/response
        raise HTTPException(status_code=500, detail="Supabase upsert returned no data")

    store_id = res.data[0]["id"]

    return InspectResponse(store_id=store_id, domain=domain, is_shopify=shopify)

@app.get("/api/coupons", response_model=CouponsResponse)
def get_coupons(url: str = Query(..., description="Store URL or domain (raw; will be normalized), e.g. scuffers.com or https://www.scuffers.com/shop")):
    """
    1) Normalize URL/domain into a clean domain
    2) Find store by domain
    3) Fetch coupons with status='active'
    4) Return {domain, is_shopify, coupons}
    """
    try:
        domain = normalize_domain(url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 1) Find store
    store_res = (
        supabase.table("stores")
        .select("id, domain, is_shopify")
        .eq("domain", domain)
        .limit(1)
        .execute()
    )

    if not store_res.data:
        raise HTTPException(status_code=404, detail=f"Store '{domain}' not found")

    store = store_res.data[0]
    store_id = store["id"]

    # 2) Fetch active coupons
    coupons_res = (
        supabase.table("coupons")
        .select("code")
        .eq("store_id", store_id)
        .eq("status", "active")
        .execute()
    )

    codes = [row["code"] for row in (coupons_res.data or [])]

    return CouponsResponse(
        domain=store["domain"],
        is_shopify=store["is_shopify"],
        coupons=codes
    )


@app.get("/api/stores", response_model=StoresResponse)
def list_stores():
    """
    Returns stores that have at least one active coupon.
    Used by Explore to show stores with available codes.
    """
    coupons_res = (
        supabase.table("coupons")
        .select("store_id")
        .eq("status", "active")
        .execute()
    )
    store_ids = list({row["store_id"] for row in (coupons_res.data or [])})
    if not store_ids:
        return StoresResponse(stores=[])

    stores_res = (
        supabase.table("stores")
        .select("id, domain, is_shopify")
        .in_("id", store_ids)
        .execute()
    )
    return StoresResponse(
        stores=[
            StoreItem(id=s["id"], domain=s["domain"], is_shopify=s["is_shopify"])
            for s in (stores_res.data or [])
        ]
    )


@app.post("/api/requests")
def create_request(
    payload: CreateRequestPayload,
    user_id: Optional[str] = Depends(get_user_id_from_token),
):
    """
    Create a request for codes for a store (e.g. Shopify store we don't have codes for).
    Requires either Bearer token (user_id) or email in body.
    """
    if not user_id and not (payload.email and payload.email.strip()):
        raise HTTPException(
            status_code=400,
            detail="Either log in (Authorization: Bearer <token>) or provide email in body",
        )
    try:
        domain = normalize_domain(payload.domain)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    store_res = (
        supabase.table("stores")
        .select("id, is_shopify")
        .eq("domain", domain)
        .limit(1)
        .execute()
    )
    if not store_res.data:
        raise HTTPException(status_code=404, detail=f"Store '{domain}' not found. Search the store first (POST /api/store/inspect).")

    store_id = store_res.data[0]["id"]
    is_shopify = bool(store_res.data[0].get("is_shopify"))
    if not is_shopify:
        raise HTTPException(status_code=400, detail="Requests are only available for Shopify stores.")
    row = {
        "store_id": store_id,
        "status": "pending",
    }
    if user_id:
        row["user_id"] = user_id
    if payload.email and payload.email.strip():
        row["email"] = payload.email.strip()

    ins = supabase.table("requests").insert(row).execute()
    if not ins.data or len(ins.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to create request")
    return {"id": ins.data[0]["id"], "store_id": store_id, "status": "pending"}


@app.get("/api/requests", response_model=RequestsResponse)
def list_my_requests(user_id: str = Depends(require_user_id)):
    """
    List requests for the authenticated user. For status=done, includes coupon codes.
    """
    req_res = (
        supabase.table("requests")
        .select("id, store_id, status, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    rows = req_res.data or []
    if not rows:
        return RequestsResponse(requests=[])

    store_ids = list({r["store_id"] for r in rows})
    stores_res = (
        supabase.table("stores")
        .select("id, domain")
        .in_("id", store_ids)
        .execute()
    )
    store_by_id = {s["id"]: s["domain"] for s in (stores_res.data or [])}

    # For status=done, fetch active coupons per store
    coupons_res = (
        supabase.table("coupons")
        .select("store_id, code")
        .in_("store_id", store_ids)
        .eq("status", "active")
        .execute()
    )
    coupons_by_store: dict = {}
    for c in (coupons_res.data or []):
        sid = c["store_id"]
        if sid not in coupons_by_store:
            coupons_by_store[sid] = []
        coupons_by_store[sid].append(c["code"])

    out = []
    for r in rows:
        domain = store_by_id.get(r["store_id"], "")
        coupons = coupons_by_store.get(r["store_id"], []) if r["status"] == "done" else []
        out.append(
            RequestItem(
                id=r["id"],
                store_id=r["store_id"],
                domain=domain,
                status=r["status"],
                created_at=r["created_at"],
                coupons=coupons,
            )
        )
    return RequestsResponse(requests=out)


@app.post("/api/saved-codes")
def save_code(
    payload: SaveCodePayload,
    user_id: str = Depends(require_user_id),
):
    """
    Save an existing active coupon code for a store to the user's saved codes.
    """
    try:
        domain = normalize_domain(payload.domain)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    store_res = (
        supabase.table("stores")
        .select("id")
        .eq("domain", domain)
        .limit(1)
        .execute()
    )
    if not store_res.data:
        raise HTTPException(status_code=404, detail=f"Store '{domain}' not found.")

    store_id = store_res.data[0]["id"]

    # Ensure the code exists and is active for this store
    coupon_res = (
        supabase.table("coupons")
        .select("id")
        .eq("store_id", store_id)
        .eq("code", payload.code)
        .eq("status", "active")
        .limit(1)
        .execute()
    )
    if not coupon_res.data:
        raise HTTPException(status_code=400, detail="Coupon code not found for this store.")

    try:
        ins = (
            supabase.table("saved_codes")
            .upsert(
                {
                    "user_id": user_id,
                    "store_id": store_id,
                    "code": payload.code,
                },
                on_conflict="user_id,store_id,code",
            )
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save code: {e}")

    row = ins.data[0]
    return {
        "id": row["id"],
        "store_id": row["store_id"],
        "code": row["code"],
    }


@app.get("/api/saved-codes", response_model=SavedCodesResponse)
def list_saved_codes(user_id: str = Depends(require_user_id)):
    """
    List codes the authenticated user has saved.
    """
    rows_res = (
        supabase.table("saved_codes")
        .select("id, store_id, code, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    rows = rows_res.data or []
    if not rows:
        return SavedCodesResponse(codes=[])

    store_ids = list({r["store_id"] for r in rows})
    stores_res = (
        supabase.table("stores")
        .select("id, domain")
        .in_("id", store_ids)
        .execute()
    )
    store_by_id = {s["id"]: s["domain"] for s in (stores_res.data or [])}

    out: List[SavedCodeItem] = []
    for r in rows:
        domain = store_by_id.get(r["store_id"], "")
        out.append(
            SavedCodeItem(
                id=r["id"],
                store_id=r["store_id"],
                domain=domain,
                code=r["code"],
                created_at=r["created_at"],
            )
        )
    return SavedCodesResponse(codes=out)

