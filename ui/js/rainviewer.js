const RainViewer = (() => {
    const META_URL = "http://localhost:8000/rainviewer/meta";
    const TILE_HOST = "http://localhost:8000/rainviewer/tile";

    let frames = [];
    let currentIndex = 0;
    let opacity = 0.8;

    let mapRef = null;
    let overlayReflectivity = null;
    let overlayFuture = null;

    let currentLayer = null;

    async function loadMeta() {
        const res = await fetch(META_URL);
        if (!res.ok) throw new Error("Failed to load RainViewer metadata");

        const data = await res.json();
        const past = data.radar?.past || [];
        const nowcast = data.radar?.nowcast || [];

        frames = past.map(f => ({
            time: f.time,
            path: f.path,
            type: "past"
        })).concat(
            nowcast.map(f => ({
                time: f.time,
                path: f.path,
                type: "future"
            }))
        );

        return frames;
    }

    function attach(map, reflectivityGroup, futureGroup) {
        mapRef = map;
        overlayReflectivity = reflectivityGroup;
        overlayFuture = futureGroup;
    }

    function setOpacity(value) {
        opacity = value;
        if (currentLayer) currentLayer.setOpacity(opacity);
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

        const cleanPath = frame.path.replace(/^\//, "");
        const urlTemplate = `${TILE_HOST}/${cleanPath}/{z}/{x}/{y}/2/1_1.png`;

        if (currentLayer) {
            overlayReflectivity?.removeLayer(currentLayer);
            overlayFuture?.removeLayer(currentLayer);
        }

        const targetGroup = frame.type === "future" ? overlayFuture : overlayReflectivity;

        currentLayer = L.tileLayer(urlTemplate, {
            tileSize: 256,
            opacity: opacity,
            zIndex: 9999,
            errorTileUrl: ""
        });

        if (targetGroup) {
            targetGroup.addLayer(currentLayer);
        } else {
            currentLayer.addTo(mapRef);
        }
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
        attach,
        setOpacity,
        getFrameCount,
        getCurrentIndex,
        getCurrentFrame,
        setFrame,
        nextFrame,
        prevFrame
    };
})();
