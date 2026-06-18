from llama_cpp import Llama
from pathlib import Path

# Path to Phi-3 Mini model
MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "phi3-mini.gguf"

_phi3 = None

def get_phi3():
    global _phi3
    if _phi3 is None:
        _phi3 = Llama(
            model_path=str(MODEL_PATH),
            n_ctx=4096,
            n_threads=4,
            use_mmap=True,
            use_mlock=False,
        )
    return _phi3

def phi3_chat(system_prompt, user_prompt, max_tokens=256):
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
