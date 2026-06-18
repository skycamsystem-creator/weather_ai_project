# backend/processing/loop.py

import time
from datetime import datetime

from processing.ensemble import EnsembleProcessor
from processing.temporal_fusion import TemporalFusion
from processing.storm_tracker import StormTracker

class ProcessingLoop:
    """
    Main intelligence engine.
    Runs every time a new radar scan arrives.
    """

    def __init__(self, mode_manager, mrms_ingest=None):
        self.mode_manager = mode_manager
        self.ensemble = EnsembleProcessor()
        self.temporal = TemporalFusion()
        self.storm_tracker = StormTracker()
        self.mrms = mrms_ingest

        self.latest_summary = None
        self.latest_feed = []
        self.latest_storms = []

    # ----------------------------------------------------
    # MAIN ENTRY POINT
    # ----------------------------------------------------
    def process_scan(self, radar_data):
        mode = self.mode_manager.state

        # Load MRMS products
        mrms_data = self.mrms.load_all() if self.mrms else {}

        # Determine ensemble passes
        if mode.max:
            passes = 8
        elif mode.boost:
            passes = 3
        else:
            passes = 1

        # Run ensemble passes
        results = []
        for _ in range(passes):
            result = self.ensemble.run(radar_data, mrms_data)
            results.append(result)

        # Temporal fusion
        fused = self.temporal.fuse(results) if mode.max else results[-1]

        # Storm tracking
        storms = self.storm_tracker.update(fused)

        # Generate outputs
        summary = self._generate_summary(storms)
        feed_entries = self._generate_feed(fused)

        self.latest_summary = summary
        self.latest_feed.extend(feed_entries)
        self.latest_storms = storms

        return summary, feed_entries, storms

    # ----------------------------------------------------
    # SUMMARY GENERATOR
    # ----------------------------------------------------
    def _generate_summary(self, storms):
        if not storms:
            return {
                "time": datetime.utcnow().strftime("%H:%M:%S UTC"),
                "title": "No active storms",
                "text": "Radar and MRMS show no significant storm structures."
            }

        strongest = max(storms, key=lambda s: s.intensity)

        return {
            "time": datetime.utcnow().strftime("%H:%M:%S UTC"),
            "title": strongest.name,
            "text": strongest.summary_text()
        }

    # ----------------------------------------------------
    # FEED GENERATOR
    # ----------------------------------------------------
    def _generate_feed(self, fused):
        feed = []
        for event in fused.events:
            feed.append({
                "time": datetime.utcnow().strftime("%H:%M:%S UTC"),
                "text": event
            })
        return feed
