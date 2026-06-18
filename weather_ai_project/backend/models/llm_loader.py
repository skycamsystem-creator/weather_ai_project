# backend/models/llm_loader.py

from typing import Optional
from llama_cpp import Llama  # pip install llama-cpp-python

from backend.models.config import (
    PHI3_MODEL_PATH,
    N_CTX,
    N_THREADS,
    N_GPU_LAYERS,
    USE_MMAP,
    USE_MLOCK,
)

_phi3_instance: Optional[Llama] = None


def get_phi3() -> Llama:
    global _phi3_instance
    if _phi3_instance is None:
        _phi3_instance = Llama(
            model_path=str(PHI3_MODEL_PATH),
            n_ctx=N_CTX,
            n_threads=N_THREADS,
            n_gpu_layers=N_GPU_LAYERS,
            use_mmap=USE_MMAP,
            use_mlock=USE_MLOCK,
            logits_all=False,
            embedding=False,
        )
    return _phi3_instance


def phi3_chat(system_prompt: str, user_prompt: str, max_tokens: int = 256) -> str:
    llm = get_phi3()
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
    out = llm.create_chat_completion(
        messages=messages,
        max_tokens=max_tokens,
        temperature=0.3,
    )
    return out["choices"][0]["message"]["content"]
