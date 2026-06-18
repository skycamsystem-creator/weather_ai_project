# backend/models/config.py

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
MODELS_DIR = BASE_DIR / "models"

PHI3_MODEL_PATH = MODELS_DIR / "phi3-mini.gguf"
MOONDREAM2_MODEL_PATH = MODELS_DIR / "moondream2.gguf"

N_CTX = 4096
N_THREADS = 4
N_GPU_LAYERS = 0
USE_MMAP = True
USE_MLOCK = False
