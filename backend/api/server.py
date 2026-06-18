# backend/api/server.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from radar.ingest import RadarIngest
from modes.mode_manager import ModeManager

# NEW: smart ingest loop + active site manager
from level2_ingest_loop import Level2IngestLoop, ActiveSitesManager

app = FastAPI()

# ---------------------------------------------------------
# CORS (UI at localhost:5173)
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Core system objects
# ---------------------------------------------------------
mode_manager = ModeManager()
ingest = RadarIngest(mode_manager)
active_manager = ActiveSitesManager()

# ---------------------------------------------------------
# Start real-time Level II ingest loop
# ---------------------------------------------------------
loop = Level2IngestLoop(ingest, mode_manager, active_manager)
loop.start()

# ---------------------------------------------------------
# API ROUTES
# ---------------------------------------------------------

@app.get("/status")
def get_status():
    """
    Returns list of radar sites + metadata.
    Updated continuously by Level2IngestLoop.
    """
    return ingest.get_status()


@app.get("/modes")
def get_modes():
    return {
        "boost": mode_manager.boost_mode,
        "max": mode_manager.max_mode,
        "clear_air": mode_manager.clear_air_mode,
        "storm": mode_manager.storm_mode,
    }


@app.post("/toggle-boost")
def toggle_boost():
    mode_manager.boost_mode = not mode_manager.boost_mode
    return {"boost": mode_manager.boost_mode}


@app.post("/toggle-max")
def toggle_max():
    mode_manager.max_mode = not mode_manager.max_mode
    return {"max": mode_manager.max_mode}


@app.get("/process-real")
def process_real(site_id: str):
    """
    Manually force a scan ingest for a site.
    """
    radar_data, vcp = ingest.load_latest_scan(site_id)

    if radar_data is None:
        return {"error": "No Level II files found"}

    return {
        "site_id": site_id,
        "vcp": vcp,
        "fields": list(radar_data.keys()),
        "status": "processed"
    }
