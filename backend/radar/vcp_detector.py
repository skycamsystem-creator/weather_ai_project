# backend/radar/vcp_detector.py

class VCPDetector:
    """
    Determines radar mode based on VCP.
    """

    CLEAR_AIR_VCPS = {31, 35}
    PRECIP_VCPS = {11, 12, 21, 31, 32, 212, 215, 112, 121, 221}

    def __init__(self):
        pass

    def classify_vcp(self, vcp_number: int) -> str:
        """
        Returns:
            "clear-air"
            "precip"
            "unknown"
        """
        if vcp_number in self.CLEAR_AIR_VCPS:
            return "clear-air"
        if vcp_number in self.PRECIP_VCPS:
            return "precip"
        return "unknown"

    def is_clear_air(self, vcp_number: int) -> bool:
        return vcp_number in self.CLEAR_AIR_VCPS

    def is_precip(self, vcp_number: int) -> bool:
        return vcp_number in self.PRECIP_VCPS
