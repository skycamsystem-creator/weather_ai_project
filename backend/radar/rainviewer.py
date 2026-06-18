# skybot/weather_ai_project/radar/rainviewer.py

import requests
from fastapi import APIRouter, HTTPException, Response

router = APIRouter(
    prefix="/rainviewer",
    tags=["rainviewer"]
)

META_URL = "https://api.rainviewer.com/public/weather-maps.json"
HOST = "https://tilecache.rainviewer.com"


@router.get("/meta")
def get_meta():
    try:
        r = requests.get(META_URL, timeout=5)
    except Exception:
        raise HTTPException(502, "RainViewer metadata request failed")

    if r.status_code != 200:
        raise HTTPException(502, f"RainViewer metadata error: {r.status_code}")

    return r.json()


@router.get("/tile/{path:path}")
def get_tile(path: str):
    url = f"{HOST}/{path}"

    try:
        r = requests.get(url, timeout=5)
    except Exception:
        raise HTTPException(502, "RainViewer tile request failed")

    if r.status_code != 200:
        raise HTTPException(502, f"RainViewer tile error: {r.status_code}")

    return Response(content=r.content, media_type="image/png")
