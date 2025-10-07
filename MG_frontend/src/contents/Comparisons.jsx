import { useState, useEffect } from "react";
import ChoroplethMap from "./ChoroplethMap";
import ComparisonGraph from "./comparisonGraph";
import statesData from "@/json_files/state_districts.json";
import axiosInstance from "@/utils/axiosInstance";
import { Loader2Icon } from "lucide-react";

export default function Comparisons() {
  const [leftState, setLeftState] = useState("");
  const [rightState, setRightState] = useState("");

  const [leftSites, setLeftSites] = useState([]);
  const [rightSites, setRightSites] = useState([]);

  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);

  const [leftSubmitCount, setLeftSubmitCount] = useState(0);
  const [rightSubmitCount, setRightSubmitCount] = useState(0);

  const [leftSite, setLeftSite] = useState(null);
  const [rightSite, setRightSite] = useState(null);

  const leftDistrictName = leftSite?.siteArea || leftSite?.siteCode || null;
  const rightDistrictName = rightSite?.siteArea || rightSite?.siteCode || null;

  // Log selected sites to debug
  useEffect(() => {
    console.log("Selected Left Site:", leftSite);
    console.log("Selected Right Site:", rightSite);
  }, [leftSite, rightSite]);

  useEffect(() => {
    if (!leftState) {
      setLeftSites([]);
      setLeftSubmitCount(0);
      setLeftSite(null);
      return;
    }
    setLeftLoading(true);
    axiosInstance
      .get(`/api/data/map/${leftState}`)
      .then((res) => {
        setLeftSites(res.data?.sites || []);
        setLeftSubmitCount((c) => c + 1);
      })
      .catch(() => {
        setLeftSites([]);
      })
      .finally(() => setLeftLoading(false));
  }, [leftState]);

  useEffect(() => {
    if (!rightState) {
      setRightSites([]);
      setRightSubmitCount(0);
      setRightSite(null);
      return;
    }
    setRightLoading(true);
    axiosInstance
      .get(`/api/data/map/${rightState}`)
      .then((res) => {
        setRightSites(res.data?.sites || []);
        setRightSubmitCount((c) => c + 1);
      })
      .catch(() => {
        setRightSites([]);
      })
      .finally(() => setRightLoading(false));
  }, [rightState]);

  // Render fallback UI if no site selected
  const renderFallbackComparison = () => (
    <div className="text-center text-gray-500 mt-10">
      Please select sites from both maps to see comparison.
    </div>
  );

  return (
    <div className="min-h-screen  px-6 py-10">
      <div className="flex flex-col md:flex-row gap-10 max-w-full mx-auto">
        {/* Left Map Section */}
        <div className="flex-1 bg-white/90 backdrop-blur-md border border-gray-200 rounded-sm shadow-lg hover:shadow-xl transition-all w-full">
          <div className="flex gap-5 p-2">
            <h2 className="font-semibold text-gray-800 mt-1">
              Left Map:{" "}
              <span className="text-indigo-600">
                {leftDistrictName || "Select a site"}
              </span>
            </h2>
            <label className="block mt-1 font-semibold text-gray-700">
              Select State (Left Map)
            </label>
            <select
              className="w-64 p-2 mb-2 border border-gray-300 rounded"
              value={leftState}
              onChange={(e) => setLeftState(e.target.value)}
            >
              <option value="">-- Select State --</option>
              {statesData.states.map((state) => (
                <option key={state.id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative w-full h-[600px] rounded-xl overflow-hidden  mb-4">
            {leftLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2Icon className="animate-spin mr-2" />
                Loading sites...
              </div>
            ) : (
              <ChoroplethMap
                onSiteSelect={setLeftSite}
                selectedState={leftState}
                allSites={leftSites}
                sitesLoading={leftLoading}
                submitCount={leftSubmitCount}
              />
            )}
          </div>
        </div>

        {/* Right Map Section */}
        <div className="flex-1 bg-white/90 backdrop-blur-md border border-gray-200 rounded-sm  shadow-lg hover:shadow-xl transition-all">
          <div className="flex gap-5 p-2">
            <h2 className="font-semibold text-gray-800 mt-1 ">
              Right Map:{" "}
              <span className="text-indigo-600">
                {rightDistrictName || "Select a site"}
              </span>
            </h2>

            <label className="block mt-1 font-semibold text-gray-700">
              Select State (Right Map)
            </label>
            <select
              className="w-64 p-2 mb-1 border border-gray-300 rounded"
              value={rightState}
              onChange={(e) => setRightState(e.target.value)}
            >
              <option value="">-- Select State --</option>
              {statesData.states.map((state) => (
                <option key={state.id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative w-full h-[600px]  mb-4">
            {rightLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2Icon className="animate-spin mr-2" />
                Loading sites...
              </div>
            ) : (
              <ChoroplethMap
                onSiteSelect={setRightSite}
                selectedState={rightState}
                allSites={rightSites}
                sitesLoading={rightLoading}
                submitCount={rightSubmitCount}
              />
            )}
          </div>
        </div>
      </div>

      {/* Comparison Graph */}
      <div className="mt-16 max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all min-h-[300px]">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Comparative Graph
        </h3>

        {leftSite && rightSite ? (
          <ComparisonGraph
            leftSite={leftSite}
            rightSite={rightSite}
            leftDistrictName={leftDistrictName}
            rightDistrictName={rightDistrictName}
          />
        ) : (
          renderFallbackComparison()
        )}
      </div>
    </div>
  );
}
