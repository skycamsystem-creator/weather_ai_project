from enum import Enum
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/ai", tags=["ai-modes"])

class AiMode(str, Enum):
    NORMAL = "normal"
    CLEAR_AIR = "clear_air"
    STORM = "storm"
    BOOST = "boost"
    MAX = "max"

class AiModeState(BaseModel):
    mode: AiMode
    source: str = "ui"  # ui, vision, general, auto

_ai_mode_state = AiModeState(mode=AiMode.NORMAL, source="ui")

@router.get("/mode", response_model=AiModeState)
def get_ai_mode():
    return _ai_mode_state

@router.put("/mode", response_model=AiModeState)
def set_ai_mode(new_state: AiModeState):
    global _ai_mode_state

    # Guardrails: auto cannot set boost/max
    if new_state.source == "auto" and new_state.mode in (AiMode.BOOST, AiMode.MAX):
        new_state.mode = AiMode.STORM

    _ai_mode_state = new_state
    return _ai_mode_state
