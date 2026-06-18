document.addEventListener("DOMContentLoaded", async () => {
    const map = L.map("map", {
        center: [37.0, -95.0],
        zoom: 5,
        zoomControl: true
    });

    // Base map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    RainViewer.attachToMap(map);

    const frameLabel = document.getElementById("frame-label");
    const prevBtn = document.getElementById("prev-frame");
    const nextBtn = document.getElementById("next-frame");
    const opacitySlider = document.getElementById("opacity-slider");

    function updateFrameLabel() {
        const total = RainViewer.getFrameCount();
        const idx = RainViewer.getCurrentIndex() + 1;
        if (total === 0) {
            frameLabel.textContent = "Frame: -- / --";
        } else {
            frameLabel.textContent = `Frame: ${idx} / ${total}`;
        }
    }

    try {
        await RainViewer.loadMeta();
        if (RainViewer.getFrameCount() > 0) {
            RainViewer.setFrame(RainViewer.getFrameCount() - 1); // latest
        }
        updateFrameLabel();
    } catch (err) {
        console.error("Failed to load RainViewer:", err);
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
        const value = parseFloat(e.target.value);
        RainViewer.setOpacity(value);
    });
});
