import { Button } from "@/components/ui/button";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Heatmaps from "@/contents/PredictedHeatmap";
import Documentation from "@/contents/Documentation";
import PredictedHeatmap from "@/contents/PredictedHeatmap";

export default function PredictiveAnalysisPage() {
  const location = useLocation();
  const isActive = (path) => location.pathname.endsWith(path);

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background:
          "linear-gradient(135deg, #F6FAFD 0%, #B3CFE5 40%, #F6FAFD 100%)",
      }}
    >
      {/* Top Navigation Buttons - Sticky */}
      <div className="sticky top-0 mt-5 z-10">
        <div className="flex gap-5 w-full">
          <Button
            className={`flex-1 h-10 ${
              isActive("/predictedHeatmaps")
                ? "bg-[#1A3D63] text-white shadow-lg"
                : "bg-[#4A7FA7] text-white"
            } border-0 ml-3 rounded-sm transition-all duration-300 font-medium hover:bg-[#1A3D63] hover:shadow-md active:bg-[#1A3D63] active:shadow-lg`}
            variant="ghost"
            asChild
          >
            <Link to="/predictive-analysis/predictedHeatmaps">
              Predicted Heatmaps
            </Link>
          </Button>
          <Button
            className={`flex-1 h-10 ${
              isActive("/documentation")
                ? "bg-[#1A3D63] text-white shadow-lg"
                : "bg-[#4A7FA7] text-white"
            } border-0 mr-3 rounded-sm transition-all duration-300 font-medium hover:bg-[#1A3D63] hover:shadow-md active:bg-[#1A3D63] active:shadow-lg`}
            variant="ghost"
            asChild
          >
            <Link to="/predictive-analysis/documentation">Documentation</Link>
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        <Routes>
          <Route path="predictedHeatmaps" element={<PredictedHeatmap />} />
          <Route path="documentation" element={<Documentation />} />
          {/* Default route when just /predictive-analysis is hit */}
          <Route index element={<Heatmaps />} />
        </Routes>
      </div>
    </div>
  );
}
