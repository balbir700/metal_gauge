import { Button } from "@/components/ui/button";
import { Routes, Route, Link } from "react-router-dom";
import Heatmaps from "@/contents/PredictedHeatmap";
import Documentation from "@/contents/Documentation";
import PredictedHeatmap from "@/contents/PredictedHeatmap";
// change this to fit pred-analysis page
export default function PredictiveAnalysisPage() {
  return (
    <>
      <div>
        <div
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            display: "flex",
            gap: "20px",
          }}
        >
          {/* This sets the path when button clicked */}
          <Button variant="outline" size="icon" className="w-177 h-18" asChild>
            <Link to="/predictive-analysis/predictedHeatmaps">Predicted Heatmaps</Link>
          </Button>
          <Button variant="outline" size="icon" className="w-177 h-18" asChild>
            <Link to="/predictive-analysis/documentation">Documentation</Link>
          </Button>
        </div>
        <hr />
      </div>

      {/* renders content based on URL */}
      <Routes>
        <Route path="predictedHeatmaps" element={<PredictedHeatmap />} />
        <Route path="documentation" element={<Documentation />} />
        {/* Default route for /analysis */}
        <Route path="/" element={<Heatmaps />} />
      </Routes>
    </>
  );
}
