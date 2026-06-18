// skybot/weather_ai_project/frontend/main.js

import { loadRainViewer, loadRainViewerAnimation } from "./rainviewer.js";

const map = L.map("map", {
    center: [37.2153, -93.2982], // Springfield, MO
    zoom: 6
});

// Basemap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
}).addTo(map);

// Load RainViewer
loadRainViewer(map);

// Or animation:
// loadRainViewerAnimation(map, 450);
