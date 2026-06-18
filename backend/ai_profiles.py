from enum import Enum
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/ai", tags=["ai-profiles"])

class AiMode(str, Enum):
    NORMAL = "normal"
    CLEAR_AIR = "clear_air"
    STORM = "storm"
    BOOST = "boost"
    MAX = "max"

class AiBehavior(BaseModel):
    cadence_seconds: int
    depth: str
    products: list[str]
    aggressiveness: int
    gpu_usage: str
    auto_escalate: bool
    auto_deescalate: bool

# Behavior profiles for both AIs
AI_BEHAVIOR_PROFILES = {
    AiMode.NORMAL: AiBehavior(
        cadence_seconds=15,
        depth="medium",
        products=["reflectivity", "alerts"],
        aggressiveness=3,
        gpu_usage="low",
        auto_escalate=True,
        auto_deescalate=True
    ),
    AiMode.CLEAR_AIR: AiBehavior(
        cadence_seconds=60,
        depth="light",
        products=["reflectivity"],
        aggressiveness=1,
        gpu_usage="minimal",
        auto_escalate=True,
        auto_deescalate=False
    ),
    AiMode.STORM: AiBehavior(
        cadence_seconds=5,
        depth="deep",
        products=["reflectivity", "velocity", "alerts"],
        aggressiveness=6,
        gpu_usage="medium",
        auto_escalate=True,
        auto_deescalate=True
    ),
    AiMode.BOOST: AiBehavior(
        cadence_seconds=2,
        depth="very_deep",
        products=["reflectivity", "velocity", "alerts"],
        aggressiveness=8,
        gpu_usage="high",
        auto_escalate=False,
        auto_deescalate=True
    ),
    AiMode.MAX: AiBehavior(
        cadence_seconds=1,
        depth="max",
        products=["reflectivity", "velocity", "alerts", "boundaries"],
        aggressiveness=10,
        gpu_usage="max",
        auto_escalate=False,
        auto_deescalate=True
    ),
}

# Current mode state
class AiModeState(BaseModel):
    mode: AiMode
    source: str = "ui"

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

@router.get("/behavior", response_model=AiBehavior)
def get_behavior():
    return AI_BEHAVIOR_PROFILES[_ai_mode_state.mode]
