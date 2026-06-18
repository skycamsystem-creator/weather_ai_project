from backend.radar import rainviewer
# skybot/weather_ai_project/app.py

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Routers


app = FastAPI(
    title="Skybot Weather AI Backend",
    version="0.1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # adjust if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(rainviewer.router)

@app.get("/")
def root():
    return {"status": "ok", "service": "Skybot Weather AI Backend"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
