const AlertsOverlay = (() => {
    const NWS_ALERTS_URL = "https://api.weather.gov/alerts/active";

    let alertsGroup = null;

    function attach(map, group) {
        alertsGroup = group;
        loadAlerts();
        setInterval(loadAlerts, 5 * 60 * 1000);
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

                let color = "#00bfff"; // advisory default
                if (severity === "severe" || severity === "extreme") color = "#ff0000";
                else if (severity === "moderate") color = "#ffcc00";

                const layer = L.geoJSON(f.geometry, {
                    style: {
                        color,
                        weight: 2,
                        fillColor: color,
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
