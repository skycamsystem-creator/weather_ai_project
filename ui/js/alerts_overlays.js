const AlertsOverlay = (() => {
    const NWS_ALERTS_URL = "https://api.weather.gov/alerts/active";

    let mapRef = null;
    let alertsGroup = null;

    function attach(map, group) {
        mapRef = map;
        alertsGroup = group;
        loadAlerts();
        setInterval(loadAlerts, 5 * 60 * 1000); // refresh every 5 minutes
    }

    async function loadAlerts() {
        if (!alertsGroup) return;

        alertsGroup.clearLayers();

        try {
            const res = await fetch(NWS_ALERTS_URL, {
                headers: { "Accept": "application/geo+json" }
            });
            if (!res.ok) return;

            const data = await res.json();
            if (!data.features) return;

            data.features.forEach(f => {
                const props = f.properties || {};
                const event = props.event || "";
                const severity = (props.severity || "").toLowerCase();

                let cls = "alert-advisory";
                if (severity === "severe" || severity === "extreme") cls = "alert-warning";
                else if (severity === "moderate") cls = "alert-watch";

                const layer = L.geoJSON(f.geometry, {
                    style: {
                        color: cls === "alert-warning" ? "#ff0000"
                              : cls === "alert-watch" ? "#ffcc00"
                              : "#00bfff",
                        weight: 2,
                        fillColor: cls === "alert-warning" ? "#ff0000"
                                  : cls === "alert-watch" ? "#ffcc00"
                                  : "#00bfff",
                        fillOpacity: 0.25
                    }
                }).bindPopup(`
                    <strong>${event}</strong><br/>
                    ${props.headline || ""}<br/>
                    ${props.areaDesc || ""}
                `);

                alertsGroup.addLayer(layer);
            });
        } catch (err) {
            console.error("Failed to load NWS alerts:", err);
        }
    }

    return {
        attach
    };
})();
