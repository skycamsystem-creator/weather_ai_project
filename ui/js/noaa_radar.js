const NOAA = (() => {
    const REFLECTIVITY = "https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q/{z}/{x}/{y}.png";
    const VELOCITY = "https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0u/{z}/{x}/{y}.png";

    function addReflectivity(group) {
        const layer = L.tileLayer(REFLECTIVITY, {
            tileSize: 256,
            opacity: 0.85,
            zIndex: 9999
        });
        group.addLayer(layer);
        return layer;
    }

    function addVelocity(group) {
        const layer = L.tileLayer(VELOCITY, {
            tileSize: 256,
            opacity: 0.85,
            zIndex: 9999
        });
        group.addLayer(layer);
        return layer;
    }

    return {
        addReflectivity,
        addVelocity
    };
})();
