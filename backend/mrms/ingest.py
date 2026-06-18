# backend/mrms/ingest.py

import glob
import os
import netCDF4
import numpy as np
from datetime import datetime

from mrms.products import MRMS_PRODUCTS
from mrms.normalizer import MRMSNormalizer

class MRMSIngest:
    """
    Loads MRMS products from disk and normalizes them.
    """

    def __init__(self, data_folder="data/mrms"):
        self.data_folder = data_folder
        self.normalizer = MRMSNormalizer()
        self.latest = {}  # store latest grids

    # ---------------------------------------------------------
    # Load newest file for a given MRMS product
    # ---------------------------------------------------------
    def load_product(self, product_key):
        product = MRMS_PRODUCTS[product_key]
        pattern = os.path.join(self.data_folder, product.filename_pattern)

        files = sorted(glob.glob(pattern))
        if not files:
            return None

        latest_file = files[-1]

        try:
            nc = netCDF4.Dataset(latest_file)
            grid = nc.variables[list(nc.variables.keys())[-1]][:]
            nc.close()
        except Exception as e:
            print(f"Error reading MRMS file {latest_file}: {e}")
            return None

        normalized = self.normalizer.normalize(grid)
        self.latest[product_key] = normalized

        return normalized

    # ---------------------------------------------------------
    # Load all MRMS products
    # ---------------------------------------------------------
    def load_all(self):
        for key in MRMS_PRODUCTS.keys():
            self.load_product(key)

        return self.latest
