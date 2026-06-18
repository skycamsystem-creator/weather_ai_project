document.addEventListener("DOMContentLoaded", async () => {
    const map = L.map("map", {
        center: [37.0, -95.0],
        zoom: 6,
        minZoom: 5,
        maxZoom: 10
    });

    // Basemaps
    const baseLayers = {
        "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19
        }),

        "ESRI Satellite": L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}",
            { maxZoom: 19 }
        ),

        "ESRI Streets": L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{x}/{y}",
            { maxZoom: 19 }
        ),

        "Dark Matter": L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            { maxZoom: 19 }
        )
    };

    baseLayers["OpenStreetMap"].addTo(map);

    L.control.layers(baseLayers, {}, { position: "topright" }).addTo(map);

    RainViewer.attachToMap(map);

    const frameLabel = document.getElementById("frame-label");
    const prevBtn = document.getElementById("prev-frame");
    const nextBtn = document.getElementById("next-frame");
    const opacitySlider = document.getElementById("opacity-slider");

    function updateFrameLabel() {
        const total = RainViewer.getFrameCount();
        const idx = RainViewer.getCurrentIndex() + 1;
        frameLabel.textContent = total === 0 ? "Frame: -- / --" : `Frame: ${idx} / ${total}`;
    }

    try {
        await RainViewer.loadMeta();
        if (RainViewer.getFrameCount() > 0) {
            RainViewer.setFrame(RainViewer.getFrameCount() - 1);
        }
        updateFrameLabel();
    } catch (err) {
        console.error("RainViewer load failed:", err);
        frameLabel.textContent = "RainViewer load failed";
    }

    prevBtn.addEventListener("click", () => {
        RainViewer.prevFrame();
        updateFrameLabel();
    });

    nextBtn.addEventListener("click", () => {
        RainViewer.nextFrame();
        updateFrameLabel();
    });

    opacitySlider.addEventListener("input", (e) => {
        RainViewer.setOpacity(parseFloat(e.target.value));
    });
});
