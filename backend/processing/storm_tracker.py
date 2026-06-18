# Storm tracking logic
# backend/processing/storm_tracker.py

class Storm:
    def __init__(self, name, intensity):
        self.name = name
        self.intensity = intensity

    def summary_text(self):
        return f"Intensity: {self.intensity:.2f}"

class StormTracker:
    """
    Tracks storms across scans.
    """

    def __init__(self):
        self.storms = []

    def update(self, fused):
        # TODO: real storm tracking
        self.storms = [
            Storm("Storm A", 0.75)
        ]
        return self.storms
