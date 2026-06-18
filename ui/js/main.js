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

    const frameLabel = document.getElementById("frame-label");

    // Mode handling
    const modeButtons = document.querySelectorAll("#mode-buttons button");

    function setActiveModeButton(mode) {
        modeButtons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.mode === mode);
        });
    }

    function setMode(mode) {
        // Reset overlays
        map.eachLayer(layer => {
            // keep base layers; overlays are managed via groups
        });

        // Ensure current base stays; we’ll just toggle overlays
        // Basemap choices per mode:
        if (mode === "chase") {
            map.removeLayer(baseLayers["OpenStreetMap"]);
            map.removeLayer(baseLayers["Mapbox Satellite"]);
            baseLayers["Dark Matter"].addTo(map);
        } else if (mode === "broadcast") {
            map.removeLayer(baseLayers["Dark Matter"]);
            baseLayers["Mapbox Satellite"].addTo(map);
        } else if (mode === "analyst") {
            map.removeLayer(baseLayers["Mapbox Satellite"]);
            baseLayers["OpenStreetMap"].addTo(map);
        }

        // Turn everything off first
        map.removeLayer(overlayReflectivity);
        map.removeLayer(overlayVelocity);
        map.removeLayer(overlayCities);
        map.removeLayer(overlayAlerts);
        map.removeLayer(overlayBoundaries);
        map.removeLayer(overlayRoads);

        // Mode presets
        if (mode === "chase") {
            overlayReflectivity.addTo(map);
            overlayVelocity.addTo(map);
            overlayCities.addTo(map);
            overlayAlerts.addTo(map);
            overlayRoads.addTo(map);
            frameLabel.textContent = "Chase Mode – Vel + Roads + Alerts";
        } else if (mode === "broadcast") {
            overlayReflectivity.addTo(map);
            overlayAlerts.addTo(map);
            overlayBoundaries.addTo(map);
            overlayCities.addTo(map);
            frameLabel.textContent = "Broadcast Mode – Sat + Refl + Alerts";
        } else if (mode === "analyst") {
            overlayReflectivity.addTo(map);
            overlayVelocity.addTo(map);
            overlayAlerts.addTo(map);
            overlayBoundaries.addTo(map);
            overlayCities.addTo(map);
            frameLabel.textContent = "Analyst Mode – Refl + Vel + Alerts";
        }

        setActiveModeButton(mode);
    }

    modeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            setMode(btn.dataset.mode);
        });
    });

    // Default mode
    setMode("analyst");
});
    // ============================
    // AI MODE ENGINE
    // ============================

    const aiModeButtons = document.querySelectorAll("#ai-mode-buttons button");
    const AI_MODE_API = "/api/ai/mode";

    function setActiveAiModeButton(mode) {
        aiModeButtons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.aiMode === mode);
        });
    }

    async function fetchAiMode() {
        try {
            const res = await fetch(AI_MODE_API);
            if (!res.ok) return;
            const data = await res.json();
            if (!data.mode) return;
            setActiveAiModeButton(data.mode);
        } catch (e) {
            console.error("Failed to fetch AI mode:", e);
        }
    }

    async function setAiMode(mode, source = "ui") {
        try {
            const res = await fetch(AI_MODE_API, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode, source })
            });
            if (!res.ok) return;
            const data = await res.json();
            setActiveAiModeButton(data.mode);
        } catch (e) {
            console.error("Failed to set AI mode:", e);
        }
    }

    aiModeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const mode = btn.dataset.aiMode;
            setAiMode(mode, "ui");
        });
    });

    // Initial sync + polling for AI-driven changes
    fetchAiMode();
    setInterval(fetchAiMode, 5000);
