# backend/api/routes.py

from fastapi import APIRouter, Request

router = APIRouter()

# ---------------------------------------------------------
# GET: Current mode state
# ---------------------------------------------------------
@router.get("/modes")
def get_modes(request: Request):
    mode = request.app.state.mode_manager.state
    return {
        "normal": mode.normal,
        "storm": mode.storm,
        "boost": mode.boost,
        "max": mode.max,
        "clear_air": mode.clear_air
    }

# ---------------------------------------------------------
# POST: Toggle Boost Mode
# ---------------------------------------------------------
@router.post("/modes/boost")
def toggle_boost(request: Request):
    state = request.app.state.mode_manager.toggle_boost()
    return {"boost": state.boost}

# ---------------------------------------------------------
# POST: Toggle Max Mode
# ---------------------------------------------------------
@router.post("/modes/max")
def toggle_max(request: Request):
    state = request.app.state.mode_manager.toggle_max()
    return {"max": state.max}

# ---------------------------------------------------------
# GET: Radar site status
# ---------------------------------------------------------
@router.get("/radar-sites")
def get_radar_sites(request: Request):
    sites = request.app.state.radar_ingest.get_status()
    return sites

# ---------------------------------------------------------
# POST: Simulate radar update (for testing)
# ---------------------------------------------------------
@router.post("/radar-sites/update")
def update_radar_site(request: Request, site_id: str, vcp: int):
    request.app.state.radar_ingest._update_site_status(site_id, vcp)
    return {"status": "updated"}

# ---------------------------------------------------------
# GET: Latest summary
# ---------------------------------------------------------
@router.get("/summary")
def get_summary(request: Request):
    return request.app.state.processing_loop.latest_summary

# ---------------------------------------------------------
# GET: AI output feed
# ---------------------------------------------------------
@router.get("/feed")
def get_feed(request: Request):
    return request.app.state.processing_loop.latest_feed[-50:]

# ---------------------------------------------------------
# GET: Storm objects
# ---------------------------------------------------------
@router.get("/storms")
def get_storms(request: Request):
    storms = request.app.state.processing_loop.latest_storms
    return [
        {
            "name": s.name,
            "intensity": s.intensity,
            "summary": s.summary_text()
        }
        for s in storms
    ]

# ---------------------------------------------------------
# POST: Process a new radar scan (dummy)
# ---------------------------------------------------------
@router.post("/process")
def process_scan(request: Request):
    radar_data = {"dummy": True}
    summary, feed, storms = request.app.state.processing_loop.process_scan(radar_data)

    return {
        "summary": summary,
        "feed": feed,
        "storms": [
            {"name": s.name, "intensity": s.intensity}
            for s in storms
        ]
    }

# ---------------------------------------------------------
# POST: Process REAL Level II radar scan
# ---------------------------------------------------------
@router.post("/process-real")
def process_real(request: Request, site_id: str):
    radar_ingest = request.app.state.radar_ingest
    processing_loop = request.app.state.processing_loop

    radar, vcp = radar_ingest.load_latest_scan(site_id)

    if radar is None:
        return {"error": "No radar data available"}

    radar_data = {
        "reflectivity": radar.fields.get("reflectivity", None),
        "velocity": radar.fields.get("velocity", None),
        "dualpol": radar.fields.get("differential_reflectivity", None),
        "metadata": radar.metadata
    }

    summary, feed, storms = processing_loop.process_scan(radar_data)

    return {
        "summary": summary,
        "feed": feed,
        "storms": [
            {"name": s.name, "intensity": s.intensity}
            for s in storms
        ]
    }
