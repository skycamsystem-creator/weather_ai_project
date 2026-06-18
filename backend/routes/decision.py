from fastapi import APIRouter
from fastapi.responses import JSONResponse

from skybot.general_ai.general_ai import GeneralAI, GeneralAIInput

router = APIRouter()
general_ai = GeneralAI()

@router.post("/decide")
async def decide(payload: dict):
    data = GeneralAIInput(
        radar=payload.get("radar", {}),
        vision=payload.get("vision", {}),
        weather=payload.get("weather", {}),
        lightning=payload.get("lightning", {}),
        cameras=payload.get("cameras", {}),
        supervisor=payload.get("supervisor", {}),
    )
    decision = general_ai.decide(data)
    return JSONResponse(
        {
            "action": decision.action,
            "reason": decision.reason,
            "confidence": decision.confidence,
            "metadata": decision.metadata,
            "timestamp": decision.timestamp,
        }
    )
