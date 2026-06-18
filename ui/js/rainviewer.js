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
        if (!res.ok) throw new Error("Failed to load RainViewer metadata");

        const data = await res.json();
        const past = data.radar?.past || [];

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
        if (tileLayer) tileLayer.setOpacity(opacity);
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

        // Remove leading slash
        const cleanPath = frame.path.replace(/^\//, "");

        const urlTemplate = `${TILE_HOST}/${cleanPath}/{z}/{x}/{y}/2/1_1.png`;

        if (tileLayer) mapRef.removeLayer(tileLayer);

        tileLayer = L.tileLayer(urlTemplate, {
            tileSize: 256,
            opacity: opacity,
            zIndex: 50,
            errorTileUrl: ""  // hide missing tiles
        });

        tileLayer.addTo(mapRef);
    }

    function nextFrame() {
        if (frames.length === 0) return;
        setFrame((currentIndex + 1) % frames.length);
    }

    function prevFrame() {
        if (frames.length === 0) return;
        setFrame((currentIndex - 1 + frames.length) % frames.length);
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
