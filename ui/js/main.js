document.addEventListener("DOMContentLoaded", async () => {
    const map = L.map("map", {
        center: [37.0, -95.0],
        zoom: 6,
        minZoom: 4,
        maxZoom: 12
    });

    // Basemaps
    const baseLayers = {
        "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19
        }),
        "ESRI Satellite": L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}",
            { maxZoom: 19 }
        ),
        "ESRI Streets": L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{x}/{y}",
            { maxZoom: 19 }
        ),
        "Dark Matter": L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            { maxZoom: 19 }
        )
    };

    baseLayers["OpenStreetMap"].addTo(map);

    // Radar overlay groups
    const overlayReflectivity = L.layerGroup().addTo(map);
    const overlayVelocity = L.layerGroup();
    const overlayMRMS = L.layerGroup();
    const overlayAI = L.layerGroup();

    const overlays = {
        "NOAA Reflectivity": overlayReflectivity,
        "NOAA Velocity": overlayVelocity,
        "MRMS (stub)": overlayMRMS,
        "AI Overlay (stub)": overlayAI
    };

    L.control.layers(baseLayers, overlays, { position: "topright", collapsed: false }).addTo(map);

    // Add NOAA radar
    NOAA.addReflectivity(map, overlayReflectivity);
    NOAA.addVelocity(map, overlayVelocity);

    // UI controls
    const opacitySlider = document.getElementById("opacity-slider");
    opacitySlider.addEventListener("input", (e) => {
        const value = parseFloat(e.target.value);
        overlayReflectivity.eachLayer(l => l.setOpacity(value));
        overlayVelocity.eachLayer(l => l.setOpacity(value));
    });

    document.getElementById("frame-label").textContent = "NOAA Radar Active";
});
