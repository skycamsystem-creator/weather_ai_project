# backend/models/vision_loader.py

from typing import Optional
from llama_cpp import Llama  # if using GGUF-compatible Moondream

from backend.models.config import (
    MOONDREAM2_MODEL_PATH,
    N_CTX,
    N_THREADS,
    N_GPU_LAYERS,
    USE_MMAP,
    USE_MLOCK,
)

_moondream_instance: Optional[Llama] = None


def get_moondream() -> Llama:
    global _moondream_instance
    if _moondream_instance is None:
        _moondream_instance = Llama(
            model_path=str(MOONDREAM2_MODEL_PATH),
            n_ctx=N_CTX,
            n_threads=N_THREADS,
            n_gpu_layers=N_GPU_LAYERS,
            use_mmap=USE_MMAP,
            use_mlock=USE_MLOCK,
            logits_all=False,
            embedding=False,
        )
    return _moondream_instance
