from __future__ import annotations

import json
from typing import Optional
from urllib.parse import urlparse
import re


def normalize_domain(raw_url: str) -> str:
    """
    Takes any user input like:
      - scuffers.com
      - www.scuffers.com
      - https://www.scuffers.com/products/x?y=z
    and returns a clean domain:
      - scuffers.com
    """
    if not raw_url or not raw_url.strip():
        raise ValueError("Empty URL")

    value = raw_url.strip()

    # If user types "scuffers.com" without scheme, urlparse treats it as path.
    if "://" not in value:
        value = "https://" + value

    parsed = urlparse(value)

    host = parsed.netloc.lower()
    if not host:
        raise ValueError("Invalid URL")

    # Remove credentials if any (rare, but possible)
    if "@" in host:
        host = host.split("@", 1)[1]

    # Remove port if any
    if ":" in host:
        host = host.split(":", 1)[0]

    # Remove leading www.
    if host.startswith("www."):
        host = host[4:]

    # Basic sanity check: must contain a dot (e.g. scuffers.com)
    if "." not in host:
        raise ValueError("Invalid domain")

    return host


SHOPIFY_PATTERNS = [
    r"cdn\.shopify\.com",
    r"Shopify\.",              # Shopify.theme etc.
    r"x-shopify-stage",
    r"shopify-section",
    r"Shopify\s*=\s*",         # "Shopify = ..."
]


def is_shopify_html(html: str) -> bool:
    if not html:
        return False
    for pat in SHOPIFY_PATTERNS:
        if re.search(pat, html, flags=re.IGNORECASE):
            return True
    return False

def is_shopify_by_cart_js(response_text: str, content_type: str) -> bool:
    """
    Shopify stores often expose /cart.js returning a small JSON object like:
    {"token": "...", "item_count": 0, "items": [] ...}
    We treat it as Shopify only if it looks like that JSON.
    """
    if not response_text:
        return False

    # Content-Type is helpful but not always reliable
    ct = (content_type or "").lower()
    looks_json = "application/json" in ct or response_text.lstrip().startswith("{")

    if not looks_json:
        return False

    try:
        data = json.loads(response_text)
    except json.JSONDecodeError:
        return False

    # Typical Shopify cart.js keys (not guaranteed, but strong signal)
    if isinstance(data, dict) and ("items" in data or "item_count" in data):
        return True

    return False

