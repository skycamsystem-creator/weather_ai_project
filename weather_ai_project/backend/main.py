# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import vision, decision

app = FastAPI(title="SkyBot Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vision.router, prefix="/vision", tags=["vision"])
app.include_router(decision.router, prefix="/decision", tags=["decision"])


@app.get("/")
async def root():
    return {"status": "ok", "service": "skybot-backend"}
