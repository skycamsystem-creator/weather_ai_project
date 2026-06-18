# backend/mrms/products.py

class MRMSProduct:
    """
    Defines MRMS product metadata.
    """

    def __init__(self, name, filename_pattern, description):
        self.name = name
        self.filename_pattern = filename_pattern
        self.description = description


# -----------------------------------------
# MRMS PRODUCT DEFINITIONS
# -----------------------------------------

MRMS_PRODUCTS = {
    "rotation_tracks": MRMSProduct(
        name="rotation_tracks",
        filename_pattern="*ROTATE*",
        description="Azimuthal shear / rotation tracks"
    ),

    "mesh": MRMSProduct(
        name="mesh",
        filename_pattern="*MESH*",
        description="Maximum Expected Size of Hail"
    ),

    "reflectivity": MRMSProduct(
        name="reflectivity",
        filename_pattern="*MergedReflectivityQC*",
        description="QC reflectivity mosaic"
    ),

    "wind": MRMSProduct(
        name="wind",
        filename_pattern="*WindSpeed*",
        description="Wind swath / damaging wind"
    ),

    "echo_tops": MRMSProduct(
        name="echo_tops",
        filename_pattern="*EchoTop*",
        description="Echo tops (storm height)"
    ),

    "vii": MRMSProduct(
        name="vii",
        filename_pattern="*VII*",
        description="Vertically Integrated Ice"
    ),
}
