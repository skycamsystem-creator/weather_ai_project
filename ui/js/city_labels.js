const CityLabels = (() => {
    const cities = [
        { name: "New York", lat: 40.7128, lon: -74.0060, pop: 8400000 },
        { name: "Los Angeles", lat: 34.0522, lon: -118.2437, pop: 4000000 },
        { name: "Chicago", lat: 41.8781, lon: -87.6298, pop: 2700000 },
        { name: "Houston", lat: 29.7604, lon: -95.3698, pop: 2300000 },
        { name: "Phoenix", lat: 33.4484, lon: -112.0740, pop: 1600000 },
        { name: "Kansas City", lat: 39.0997, lon: -94.5786, pop: 508000 },
        { name: "St. Louis", lat: 38.6270, lon: -90.1994, pop: 300000 },
        { name: "Springfield", lat: 37.2089, lon: -93.2923, pop: 170000 },
        { name: "Joplin", lat: 37.0842, lon: -94.5133, pop: 51000 },
        { name: "Carthage", lat: 37.1764, lon: -94.3100, pop: 15000 }
    ];

    let labelGroup = null;
    let mapRef = null;

    function attach(map, group) {
        mapRef = map;
        labelGroup = group;
        map.on("zoomend", updateLabels);
        updateLabels();
    }

    function updateLabels() {
        if (!mapRef || !labelGroup) return;

        const zoom = mapRef.getZoom();
        labelGroup.clearLayers();

        cities.forEach(city => {
            if (zoom <= 5 && city.pop < 1000000) return;
            if (zoom === 6 && city.pop < 300000) return;
            if (zoom === 7 && city.pop < 100000) return;
            if (zoom === 8 && city.pop < 30000) return;
            // zoom 9+ shows all

            const label = L.marker([city.lat, city.lon], {
                icon: L.divIcon({
                    className: "city-label",
                    html: `<span>${city.name}</span>`,
                    iconSize: [100, 20]
                })
            });

            labelGroup.addLayer(label);
        });
    }

    return {
        attach
    };
})();
