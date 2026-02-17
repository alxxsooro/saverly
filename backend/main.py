from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from supabase_client import supabase
from typing import List
from fastapi import Query

from utils import normalize_domain, is_shopify_html, is_shopify_by_cart_js

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

