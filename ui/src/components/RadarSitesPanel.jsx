// src/components/RadarSitesPanel.jsx

import { useEffect, useState } from "react";
import { fetchStatus, processReal } from "../api";

export default function RadarSitesPanel() {
  const [sites, setSites] = useState([]);

  async function refresh() {
    const data = await fetchStatus();
    setSites(data);
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="panel-title">Radar Sites</div>
      {sites.map((s) => (
        <div
          key={s.site_id}
          className="radar-site"
          onClick={() => processReal(s.site_id)}
        >
          <strong>{s.site_id}</strong> — VCP {s.vcp} — {s.mode}
          <br />
          <small>Last scan: {s.last_scan}</small>
        </div>
      ))}
    </>
  );
}
