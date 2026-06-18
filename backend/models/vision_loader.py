from llama_cpp import Llama
from pathlib import Path

# Path to Moondream2 model
MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "moondream2.gguf"

_moondream = None

def get_moondream():
    global _moondream
    if _moondream is None:
        _moondream = Llama(
            model_path=str(MODEL_PATH),
            n_ctx=2048,
            n_threads=4,
            use_mmap=True,
            use_mlock=False,
        )
    return _moondream
