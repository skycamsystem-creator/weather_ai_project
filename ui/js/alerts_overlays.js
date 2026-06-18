const AlertsOverlay = (() => {
    const NWS_ALERTS_URL = "https://api.weather.gov/alerts/active";

    let alertsGroup = null;

    function attach(map, group) {
        alertsGroup = group;
        loadAlerts();
        setInterval(loadAlerts, 5 * 60 * 1000);
    }

    function getAlertColor(event) {
        const e = (event || "").toLowerCase();

        // Tornado / severe
        if (e.includes("tornado warning")) return "#ff0000";        // strong red
        if (e.includes("severe thunderstorm warning")) return "#ffcc00"; // bright yellow
        if (e.includes("flash flood warning")) return "#00ff00";    // bright green

        // Watches
        if (e.includes("tornado watch")) return "#ff66cc";          // magenta
        if (e.includes("severe thunderstorm watch")) return "#ff9900"; // orange
        if (e.includes("flood watch")) return "#00cc66";            // teal-green

        // Advisories
        if (e.includes("flood advisory")) return "#66ff66";         // light green
        if (e.includes("winter storm warning")) return "#9900ff";   // deep purple
        if (e.includes("winter weather advisory")) return "#9999ff";// soft purple
        if (e.includes("high wind warning")) return "#ff8800";      // amber
        if (e.includes("red flag warning")) return "#ff00ff";       // hot pink
        if (e.includes("special marine warning")) return "#00ffff"; // cyan
        if (e.includes("heat advisory")) return "#ff6600";          // deep orange
        if (e.includes("dense fog advisory")) return "#cccccc";     // gray
        if (e.includes("air quality alert")) return "#66cc00";      // lime

        // Default: softer blue for misc alerts
        return "#00bfff";
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
                const color = getAlertColor(event);

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
