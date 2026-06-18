// src/api.js

const API_BASE = "http://localhost:8000"; // FastAPI backend

export async function fetchStatus() {
  const res = await fetch(`${API_BASE}/status`);
  return res.json();
}

export async function fetchModes() {
  const res = await fetch(`${API_BASE}/modes`);
  return res.json();
}

export async function toggleBoost() {
  const res = await fetch(`${API_BASE}/toggle-boost`, { method: "POST" });
  return res.json();
}

export async function toggleMax() {
  const res = await fetch(`${API_BASE}/toggle-max`, { method: "POST" });
  return res.json();
}

export async function processReal(siteId) {
  const res = await fetch(`${API_BASE}/process-real?site_id=${siteId}`);
  return res.json();
}
