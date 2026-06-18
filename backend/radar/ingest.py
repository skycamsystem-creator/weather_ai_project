# backend/radar/ingest.py

import os
import requests
from datetime import datetime
from pathlib import Path

class RadarIngest:
    def __init__(self, mode_manager):
        self.mode_manager = mode_manager

        # Stores metadata for ALL sites
        # Filled by update_site_status() and download_and_process()
        self.sites = {}  # { "KSGF": { "last_file": "...", "last_scan": "...", "vcp": 12 } }

        # Where Level II files will be saved
        self.storage = Path("data/level2")
        self.storage.mkdir(parents=True, exist_ok=True)

    # ---------------------------------------------------------
    # STATUS MANAGEMENT
    # ---------------------------------------------------------
    def update_site_status(self, site_id, newest_file):
        """
        Called by Level2IngestLoop for ALL sites.
        Updates metadata even if site is not active.
        """
        if site_id not in self.sites:
            self.sites[site_id] = {
                "site_id": site_id,
                "last_file": None,
                "last_scan": None,
                "vcp": None,
            }

        self.sites[site_id]["last_file"] = newest_file

    def get_status(self):
        """
        Returns list of site metadata for the UI.
        """
        return list(self.sites.values())

    # ---------------------------------------------------------
    # FILE DOWNLOAD + PROCESSING
    # ---------------------------------------------------------
    def download_and_process(self, site_id, filename):
        """
        Downloads newest Level II file and processes it.
        Called ONLY for active sites.
        """
        url = f"https://thredds.ucar.edu/thredds/fileServer/nexrad/level2/{site_id}/{filename}"
        local_path = self.storage / site_id
        local_path.mkdir(parents=True, exist_ok=True)

        file_path = local_path / filename

        # Download file
        try:
            r = requests.get(url, timeout=10)
            if r.status_code != 200:
                print(f"Failed to download {filename}")
                return

            with open(file_path, "wb") as f:
                f.write(r.content)

        except Exception as e:
            print(f"Download error for {site_id}: {e}")
            return

        # Process file
        radar_data, vcp = self._process_level2(file_path)

        # Update metadata
        self.sites[site_id]["last_scan"] = datetime.utcnow().strftime("%H:%M:%S UTC")
        self.sites[site_id]["vcp"] = vcp

        print(f"Processed {site_id} scan {filename} (VCP {vcp})")

    # ---------------------------------------------------------
    # MANUAL PROCESSING (UI button)
    # ---------------------------------------------------------
    def load_latest_scan(self, site_id):
        """
        Used by /process-real endpoint.
        Finds newest file in local storage and processes it.
        """
        site_dir = self.storage / site_id
        if not site_dir.exists():
            return None, None

        files = sorted(site_dir.glob("*"))
        if not files:
            return None, None

        newest = files[-1]
        radar_data, vcp = self._process_level2(newest)
        return radar_data, vcp

    # ---------------------------------------------------------
    # INTERNAL DECODER (placeholder)
    # ---------------------------------------------------------
    def _process_level2(self, file_path):
        """
        Placeholder Level II decoder.
        Replace with PyART or your custom decoder later.
        """
        # Fake radar fields for now
        radar_data = {
            "reflectivity": True,
            "velocity": True,
            "spectrum_width": True
        }

        # Extract VCP from filename if possible
        name = file_path.name
        vcp = None
        if "_V0" in name:
            try:
                vcp = int(name.split("_V0")[1][:2])
            except:
                vcp = None

        return radar_data, vcp
