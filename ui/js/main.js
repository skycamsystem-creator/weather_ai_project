document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map", {
        center: [37.0, -95.0],
        zoom: 6,
        minZoom: 4,
        maxZoom: 12
    });

    const mapboxToken = "pk.eyJ1IjoibG9uZWx5YnJpc2tldCIsImEiOiJjbW1reGFhNDcxdm1jMnBwcjN3OTVkZWYyIn0.pwuGLS_Xkpj5Q4nf_uRs-A";

    const baseLayers = {
        "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }),
        "Mapbox Satellite": L.tileLayer(
            "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}?access_token=" + mapboxToken,
            {
                maxZoom: 19,
                tileSize: 256,
                attribution: "&copy; Mapbox &copy; OpenStreetMap"
            }
        ),
        "Dark Matter": L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution: "&copy; Carto &copy; OpenStreetMap"
            }
        )
    };

    baseLayers["Mapbox Satellite"].addTo(map);

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

    const reflLayer = NOAA.addReflectivity(overlayReflectivity);
    const velLayer = NOAA.addVelocity(overlayVelocity);

    const opacitySlider = document.getElementById("opacity-slider");
    opacitySlider.addEventListener("input", (e) => {
        const value = parseFloat(e.target.value);
        overlayReflectivity.eachLayer(l => l.setOpacity(value));
        overlayVelocity.eachLayer(l => l.setOpacity(value));
    });

    document.getElementById("frame-label").textContent = "NOAA Radar (Reflectivity / Velocity)";
});
    // City labels overlay
    const overlayCities = L.layerGroup().addTo(map);
    CityLabels.attach(map, overlayCities);
});
