document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map", {
        center: [37.0, -95.0],
        zoom: 6,
        minZoom: 4,
        maxZoom: 12
    });

    const mapboxToken = "pk.eyJ1IjoibG9uZWx5YnJpc2tldCIsImEiOiJjbW1reGFhNDcxdm1jMnBwcjN3OTVkZWYyIn0.pwuGLS_Xkpj5Q4nf_uRs-A";

    // Basemaps
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

    // Overlays (all real)
    const overlayReflectivity = L.layerGroup().addTo(map);
    const overlayVelocity = L.layerGroup();
    const overlayCities = L.layerGroup().addTo(map);
    const overlayAlerts = L.layerGroup().addTo(map);

    const overlayBoundaries = L.tileLayer(
        "https://stamen-tiles.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}.png",
        {
            maxZoom: 18,
            opacity: 0.5,
            zIndex: 880,
            attribution: "&copy; Stamen &copy; OpenStreetMap"
        }
    );

    const overlayRoads = L.tileLayer(
        "https://stamen-tiles.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}.png",
        {
            maxZoom: 18,
            opacity: 0.6,
            zIndex: 885,
            attribution: "&copy; Stamen &copy; OpenStreetMap"
        }
    );

    const overlays = {
        "NOAA Reflectivity": overlayReflectivity,
        "NOAA Velocity": overlayVelocity,
        "Cities": overlayCities,
        "NWS Alerts (WWA)": overlayAlerts,
        "Borders / Counties": overlayBoundaries,
        "Roads / Highways": overlayRoads
    };

    L.control.layers(baseLayers, overlays, { position: "topright", collapsed: false }).addTo(map);

    // Radar
    NOAA.addReflectivity(overlayReflectivity);
    NOAA.addVelocity(overlayVelocity);

    // City labels
    CityLabels.attach(map, overlayCities);

    // NWS alerts
    AlertsOverlay.attach(map, overlayAlerts);

    // Opacity control for radar only
    const opacitySlider = document.getElementById("opacity-slider");
    opacitySlider.addEventListener("input", (e) => {
        const value = parseFloat(e.target.value);
        overlayReflectivity.eachLayer(l => l.setOpacity(value));
        overlayVelocity.eachLayer(l => l.setOpacity(value));
    });

    document.getElementById("frame-label").textContent = "NOAA Radar + Cities + Alerts (Hybrid Pro Colors)";
});
