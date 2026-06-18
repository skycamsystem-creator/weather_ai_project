// src/components/Dashboard.jsx

import ModesPanel from "./ModesPanel";
import RadarSitesPanel from "./RadarSitesPanel";
import SummaryPanel from "./SummaryPanel";
import StormsPanel from "./StormsPanel";
import FeedPanel from "./FeedPanel";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="panel modes-panel"><ModesPanel /></div>
      <div className="panel sites-panel"><RadarSitesPanel /></div>
      <div className="panel summary-panel"><SummaryPanel /></div>
      <div className="panel storms-panel"><StormsPanel /></div>
      <div className="panel feed-panel"><FeedPanel /></div>
    </div>
  );
}
