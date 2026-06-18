# Multi-pass ensemble logic
# backend/processing/ensemble.py

class EnsembleResult:
    def __init__(self):
        self.features = {}
        self.patterns = {}
        self.events = []  # feed entries
        self.raw_output = None

class EnsembleProcessor:
    """
    Runs one pass of the AI models.
    """

    def __init__(self):
        pass  # load models later

    def run(self, radar_data):
        result = EnsembleResult()

        # -------------------------
        # Vision model (structure)
        # -------------------------
        result.features["vision"] = self._run_vision(radar_data)

        # -------------------------
        # Reasoning model (analysis)
        # -------------------------
        result.raw_output = self._run_reasoning(result.features)

        # -------------------------
        # Pattern detection
        # -------------------------
        result.patterns = self._detect_patterns(result.raw_output)

        # -------------------------
        # Generate events for feed
        # -------------------------
        result.events = self._generate_events(result.patterns)

        return result

    def _run_vision(self, radar_data):
        return {
            "hook": False,
            "bow": False,
            "couplet": False,
            "hail_core": False
        }

    def _run_reasoning(self, features):
        return {
            "storm_mode": "supercell",
            "ef2_potential": 0.42,
            "outbreak_score": 0.31
        }

    def _detect_patterns(self, output):
        return {
            "rotation_strength": output["ef2_potential"] * 0.8,
            "hail_growth": output["outbreak_score"] * 0.5
        }

    def _generate_events(self, patterns):
        events = []

        if patterns["rotation_strength"] > 0.5:
            events.append("Rotation strengthening — tornado potential increasing.")

        if patterns["hail_growth"] > 0.3:
            events.append("Hail core intensifying.")

        return events
