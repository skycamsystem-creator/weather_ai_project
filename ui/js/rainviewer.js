const RainViewer = (() => {
    const META_URL = "http://localhost:8000/rainviewer/meta";
    const TILE_HOST = "http://localhost:8000/rainviewer/tile";

    let frames = [];
    let currentIndex = 0;
    let tileLayer = null;
    let mapRef = null;
    let opacity = 0.8;

    async function loadMeta() {
        const res = await fetch(META_URL);
        if (!res.ok) {
            throw new Error("Failed to load RainViewer metadata");
        }
        const data = await res.json();

        const past = data.radar && data.radar.past ? data.radar.past : [];
        frames = past.map(f => ({
            time: f.time,
            path: f.path
        }));

        return frames;
    }

    function attachToMap(map) {
        mapRef = map;
    }

    function setOpacity(value) {
        opacity = value;
        if (tileLayer) {
            tileLayer.setOpacity(opacity);
        }
    }

    function getFrameCount() {
        return frames.length;
    }

    function getCurrentIndex() {
        return currentIndex;
    }

    function getCurrentFrame() {
        return frames[currentIndex] || null;
    }

    function setFrame(index) {
        if (!mapRef || frames.length === 0) return;
        if (index < 0 || index >= frames.length) return;

        currentIndex = index;
        const frame = frames[currentIndex];

        // FIX: remove leading slash to avoid double slashes
        const cleanPath = frame.path.startsWith("/") ? frame.path.slice(1) : frame.path;

        const urlTemplate = `${TILE_HOST}/${cleanPath}/{z}/{x}/{y}/2/1_1.png`;

        if (tileLayer) {
            mapRef.removeLayer(tileLayer);
        }

        tileLayer = L.tileLayer(urlTemplate, {
            tileSize: 256,
            opacity: opacity,
            zIndex: 50
        });

        tileLayer.addTo(mapRef);
    }

    function nextFrame() {
        if (frames.length === 0) return;
        const next = (currentIndex + 1) % frames.length;
        setFrame(next);
    }

    function prevFrame() {
        if (frames.length === 0) return;
        const prev = (currentIndex - 1 + frames.length) % frames.length;
        setFrame(prev);
    }

    return {
        loadMeta,
        attachToMap,
        setOpacity,
        getFrameCount,
        getCurrentIndex,
        getCurrentFrame,
        setFrame,
        nextFrame,
        prevFrame
    };
})();
