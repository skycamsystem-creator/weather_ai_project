# Past 3-10 scan fusion
# backend/processing/temporal_fusion.py

class TemporalFusion:
    """
    Fuses 3–10 past scans + 8 ensemble passes.
    """

    def __init__(self):
        self.history = []

    def fuse(self, ensemble_results):
        # Add to history
        self.history.append(ensemble_results[-1])
        self.history = self.history[-10:]  # keep last 10 scans

        # Weighted fusion
        fused = ensemble_results[-1]  # start with latest

        # TODO: implement real fusion logic
        return fused
