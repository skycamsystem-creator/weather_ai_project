// src/components/ModesPanel.jsx

import { useEffect, useState } from "react";
import { fetchModes, toggleBoost, toggleMax } from "../api";

export default function ModesPanel() {
  const [modes, setModes] = useState({});

  async function refresh() {
    const data = await fetchModes();
    setModes(data);
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="panel-title">Modes</div>

      <span
        className={`mode-button ${modes.boost ? "mode-active" : ""}`}
        onClick={async () => {
          await toggleBoost();
          refresh();
        }}
      >
        Boost
      </span>

      <span
        className={`mode-button ${modes.max ? "mode-active" : ""}`}
        onClick={async () => {
          await toggleMax();
          refresh();
        }}
      >
        Max
      </span>

      <span className="mode-button">
        {modes.clear_air ? "Clear Air" : modes.storm ? "Storm Mode" : "Normal"}
      </span>
    </>
  );
}
