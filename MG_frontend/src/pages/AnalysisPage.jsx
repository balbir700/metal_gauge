import { Button } from "@/components/ui/button";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Graph from "./Graph";
import Maps from "@/contents/Maps";
import Comparisons from "@/contents/Comparisons";
import Overview from "@/contents/Overview";

export default function AnalysisPage() {
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
              isActive("/graphs")
                ? "bg-[#1A3D63] text-white shadow-lg"
                : "bg-[#4A7FA7] text-white"
            } border-0 ml-3 rounded-sm transition-all duration-300 font-medium hover:bg-[#1A3D63] hover:shadow-md active:bg-[#1A3D63] active:shadow-lg`}
            variant="ghost"
            asChild
          >
            <Link to="/analysis/graphs">Graphs</Link>
          </Button>
          <Button
            className={`flex-1 h-10 ${
              isActive("/maps")
                ? "bg-[#1A3D63] text-white shadow-lg"
                : "bg-[#4A7FA7] text-white"
            } border-0 rounded-sm transition-all duration-300 font-medium hover:bg-[#1A3D63] hover:shadow-md active:bg-[#1A3D63] active:shadow-lg`}
            variant="ghost"
            asChild
          >
            <Link to="/analysis/maps">Maps</Link>
          </Button>
          <Button
            className={`flex-1 h-10 ${
              isActive("/comparisons")
                ? "bg-[#1A3D63] text-white shadow-lg"
                : "bg-[#4A7FA7] text-white"
            } border-0 rounded-sm transition-all duration-300 font-medium hover:bg-[#1A3D63] hover:shadow-md active:bg-[#1A3D63] active:shadow-lg`}
            variant="ghost"
            asChild
          >
            <Link to="/analysis/comparisons">Comparisons</Link>
          </Button>
          <Button
            className={`flex-1 h-10 ${
              isActive("/overview")
                ? "bg-[#1A3D63] text-white shadow-lg"
                : "bg-[#4A7FA7] text-white"
            } border-0 mr-3 rounded-sm transition-all duration-300 font-medium hover:bg-[#1A3D63] hover:shadow-md active:bg-[#1A3D63] active:shadow-lg`}
            variant="ghost"
            asChild
          >
            <Link to="/analysis/overview">Overview</Link>
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        <Routes>
          <Route path="graphs" element={<Graph />} />
          <Route path="maps" element={<Maps />} />
          <Route path="comparisons" element={<Comparisons />} />
          <Route path="overview" element={<Overview />} />
          {/* Default route when just /analysis is hit */}
          <Route index element={<Graph />} />
        </Routes>
      </div>
    </div>
  );
}
