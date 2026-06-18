// skybot/weather_ai_project/frontend/rainviewer.js

export async function loadRainViewer(map) {
    const meta = await fetch("/rainviewer/meta").then(r => r.json());
    const latest = meta.radar.past.at(-1);
    const path = latest.path;

    const tileTemplate = `/rainviewer/tile${path}/256/{z}/{x}/{y}/2/1_1.png`;

    const layer = L.tileLayer(tileTemplate, {
        tileSize: 256,
        opacity: 0.65,
        zIndex: 1000
    });

    layer.addTo(map);

    return { meta, layer };
}

export async function loadRainViewerAnimation(map, speed = 500) {
    const meta = await fetch("/rainviewer/meta").then(r => r.json());
    const frames = meta.radar.past;

    let index = 0;
    let layer = null;

    function showFrame(i) {
        const frame = frames[i];
        const path = frame.path;

        const url = `/rainviewer/tile${path}/256/{z}/{x}/{y}/2/1_1.png`;

        if (layer) map.removeLayer(layer);

        layer = L.tileLayer(url, {
            tileSize: 256,
            opacity: 0.65,
            zIndex: 1000
        });

        layer.addTo(map);
    }

    setInterval(() => {
        showFrame(index);
        index = (index + 1) % frames.length;
    }, speed);

    showFrame(0);
}
