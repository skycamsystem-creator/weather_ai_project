# backend/level2_ingest_loop.py

import time
import threading
import requests
from datetime import datetime
from radar.ingest import RadarIngest
from modes.mode_manager import ModeManager

# ---------------------------------------------------------
# ALL NEXRAD SITES (full national list)
# ---------------------------------------------------------
ALL_SITES = [
    "KABR","KABX","KAKQ","KAMA","KAMX","KAPX","KARX","KATX","KBBX","KBGM","KBHX",
    "KBIS","KBLX","KBMX","KBOX","KBRO","KBUF","KBYX","KCAE","KCBW","KCBX","KCCX",
    "KCLE","KCLX","KCRI","KCYS","KDAX","KDDC","KDFX","KDIX","KDLH","KDMX","KDOX",
    "KDTX","KDVN","KDYX","KEAX","KEMX","KENX","KEOX","KEPZ","KESX","KEVX","KEWX",
    "KEYX","KFCX","KFDR","KFDX","KFFC","KFSD","KFSX","KFTG","KFWS","KGGW","KGJX",
    "KGLD","KGRB","KGRK","KGRR","KGSP","KGWX","KGYX","KHDX","KHGX","KHNX","KHPX",
    "KHTX","KICT","KICX","KILN","KILX","KIND","KINX","KIWA","KIWX","KJAX","KJGX",
    "KJKL","KLBB","KLCH","KLGX","KLIX","KLNX","KLOT","KLRX","KLSX","KLTX","KLVX",
    "KLWX","KLZK","KMAF","KMAX","KMBX","KMHX","KMKX","KMLB","KMOB","KMPX","KMQT",
    "KMRX","KMSX","KMTX","KMUX","KMVX","KMXX","KNKX","KNQA","KOAX","KOHX","KOKX",
    "KOTX","KPAH","KPBZ","KPDT","KPOE","KPUX","KRAX","KRGX","KRIW","KRLX","KRTX",
    "KSFX","KSGF","KSHV","KSJT","KSOX","KSRX","KTBW","KTFX","KTLH","KTLX","KTWX",
    "KTYX","KUDX","KUEX","KVAX","KVBX","KVNX","KVTX","KVWX","KYUX"
]

# ---------------------------------------------------------
# Smart Active Site Manager
# ---------------------------------------------------------
class ActiveSitesManager:
    def __init__(self):
        # Start with your local region active
        self.active = {"KSGF", "KINX", "KLSX"}

    def get_active(self):
        return self.active

    def promote(self, site):
        self.active.add(site)

    def demote(self, site):
        if site in self.active:
            self.active.remove(site)

    def auto_update(self, mrms_storm_sites):
        """
        Example: AI/MRMS says storms near KSGF + KINX
        """
        self.active = set(mrms_storm_sites)

# ---------------------------------------------------------
# THREDDS helper
# ---------------------------------------------------------
def get_newest_file(site_id):
    """
    Returns newest Level II filename for a site from THREDDS.
    """
    url = f"https://thredds.ucar.edu/thredds/catalog/nexrad/level2/{site_id}/catalog.xml"
    try:
        r = requests.get(url, timeout=5)
        if r.status_code != 200:
            return None

        # Find last <dataset name="...">
        lines = r.text.split("\n")
        datasets = [line for line in lines if 'dataset name="' in line]

        if not datasets:
            return None

        newest = datasets[-1]
        name = newest.split('dataset name="')[1].split('"')[0]
        return name
    except:
        return None

# ---------------------------------------------------------
# Real-time ingest loop
# ---------------------------------------------------------
class Level2IngestLoop:
    def __init__(self, ingest: RadarIngest, mode_manager: ModeManager, active_manager: ActiveSitesManager):
        self.ingest = ingest
        self.mode_manager = mode_manager
        self.active_manager = active_manager
        self.last_downloaded = {site: None for site in ALL_SITES}

    def start(self):
        thread = threading.Thread(target=self.loop, daemon=True)
        thread.start()

    def loop(self):
        print("Level II ingest loop started (real-time, all sites tracked).")

        while True:
            active_sites = self.active_manager.get_active()

            for site in ALL_SITES:
                newest = get_newest_file(site)
                if newest is None:
                    continue

                # Update metadata for UI even if inactive
                self.ingest.update_site_status(site, newest)

                # Only ingest active sites
                if site not in active_sites:
                    continue

                if newest != self.last_downloaded[site]:
                    print(f"[{datetime.utcnow()}] New scan detected for {site}: {newest}")

                    # Download + process
                    self.ingest.download_and_process(site, newest)

                    # Update last seen
                    self.last_downloaded[site] = newest

            # No sleep → real-time loop
            # THREDDS only updates when new scans exist, so this is efficient
            time.sleep(0.2)
