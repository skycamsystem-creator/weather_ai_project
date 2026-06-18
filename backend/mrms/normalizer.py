# backend/mrms/normalizer.py

import numpy as np

class MRMSNormalizer:
    """
    Converts MRMS grids into normalized arrays for AI processing.
    """

    def normalize(self, grid):
        if grid is None:
            return None

        arr = np.array(grid, dtype=float)

        # Replace missing values
        arr[arr < -9990] = np.nan

        # Normalize to 0–1 range
        min_val = np.nanmin(arr)
        max_val = np.nanmax(arr)

        if max_val - min_val == 0:
            return arr

        return (arr - min_val) / (max_val - min_val)
