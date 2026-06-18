from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse

from skybot.vision_ai.vision_ai import VisionAI

router = APIRouter()
vision_ai = VisionAI()

@router.post("/analyze-frame")
async def analyze_frame(file: UploadFile = File(...)):
    content = await file.read()
    result = vision_ai.process_frame_bytes(content)
    return JSONResponse(result)
