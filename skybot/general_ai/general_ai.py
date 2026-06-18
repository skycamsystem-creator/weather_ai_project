from dataclasses import dataclass, field
from typing import Dict, Any, Optional
import time
import json

from backend.models.llm_loader import phi3_chat

@dataclass
class GeneralAIInput:
    radar: Dict[str, Any]
    vision: Dict[str, Any]
    weather: Dict[str, Any]
    lightning: Dict[str, Any]
    cameras: Dict[str, Any]
    supervisor: Dict[str, Any]

@dataclass
class GeneralAIDecision:
    action: str
    reason: str
    confidence: float
    metadata: Dict[str, Any] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)

class GeneralAI:
    def __init__(self):
        self.last_decision: Optional[GeneralAIDecision] = None

    def fuse_inputs(self, data: GeneralAIInput) -> Dict[str, Any]:
        fused = {
            "radar_threat": data.radar.get("threat_level", 0),
            "vision_threat": data.vision.get("threat_level", 0),
            "weather_threat": data.weather.get("threat_level", 0),
            "lightning_rate": data.lightning.get("strikes_last_min", 0),
            "camera_status": data.cameras,
            "supervisor_flags": data.supervisor,
        }

        fused["combined_threat"] = (
            fused["radar_threat"] * 0.4 +
            fused["vision_threat"] * 0.3 +
            fused["weather_threat"] * 0.3
        )

        return fused

    def heuristic_decision(self, fused: Dict[str, Any]) -> Dict[str, Any]:
        threat = fused["combined_threat"]
        lightning = fused["lightning_rate"]

        if threat >= 80 or lightning >= 20:
            return {"action": "send_alert", "reason": "High threat detected", "confidence": 0.75}

        if 50 <= threat < 80:
            return {"action": "request_more_data", "reason": "Moderate threat", "confidence": 0.55}

        return {"action": "idle", "reason": "Low threat", "confidence": 0.30}

    def ai_interpretation(self, fused: Dict[str, Any], heuristic: Dict[str, Any]) -> Dict[str, Any]:
        system_prompt = (
            "You are SkyBot, a weather decision assistant. "
            "You receive fused radar, vision, weather, and lightning data."
        )

        user_prompt = (
            f"Fused data: {fused}\n"
            f"Heuristic suggestion: {heuristic}\n"
            "Respond in JSON with keys: action, reason, confidence."
        )

        try:
            raw = phi3_chat(system_prompt, user_prompt, max_tokens=256)
            parsed = json.loads(raw)
            return {
                "action": parsed.get("action", heuristic["action"]),
                "reason": parsed.get("reason", heuristic["reason"]),
                "confidence": float(parsed.get("confidence", heuristic["confidence"])),
            }
        except Exception:
            return heuristic

    def decide(self, data: GeneralAIInput) -> GeneralAIDecision:
        fused = self.fuse_inputs(data)
        heuristic = self.heuristic_decision(fused)
        ai = self.ai_interpretation(fused, heuristic)

        decision = GeneralAIDecision(
            action=ai["action"],
            reason=ai["reason"],
            confidence=ai["confidence"],
            metadata={"fused": fused},
        )

        self.last_decision = decision
        return decision
