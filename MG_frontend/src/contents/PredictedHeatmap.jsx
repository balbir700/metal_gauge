import { useState } from "react";
import HtmlView from "./Heatmaps";

export default function HeatmapWithDetails() {
  const [, setSelectedPoint] = useState(null);

  function handlePointClick(data) {
    setSelectedPoint(data);
  }

  return (
    <div style={{ flex: 2 }}>
      <HtmlView onPointClick={handlePointClick} />
    </div>
  );
}
