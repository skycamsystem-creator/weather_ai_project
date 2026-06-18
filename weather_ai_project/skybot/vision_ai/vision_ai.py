# skybot/vision_ai/vision_ai.py

from dataclasses import dataclass
from typing import Dict, Any

from backend.models.vision_loader import get_moondream


@dataclass
class VisionResult:
    threat_level: int
    description: str
    raw: Dict[str, Any]


class VisionAI:
    def __init__(self):
        self._model = None

    def _ensure_model(self):
        if self._model is None:
            self._model = get_moondream()

    def process_frame_bytes(self, frame_bytes: bytes) -> Dict[str, Any]:
        # TODO: real Moondream 2 inference using frame_bytes
        # self._ensure_model()
        # result = ...
        threat_level = 10
        description = "Placeholder: calm sky / no severe features detected."
        return {
            "threat_level": threat_level,
            "description": description,
        }
