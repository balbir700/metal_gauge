// src/contents/Maps.jsx
import React, { useState, useEffect } from "react";
import { Loader2Icon } from "lucide-react";
import "leaflet/dist/leaflet.css";
import ChoroplethMap from "@/contents/ChoroplethMap";
import statesData from "@/json_files/state_districts.json";
import axiosInstance from "@/utils/axiosInstance";

const DataParametersGrid = ({ site }) => {
  // Define standard maximum permissible limits (in µg/L for example)
  const LIMITS = {
    Arsenic: 10,
    Zinc: 3000,
    Copper: 1000,
    Lead: 10,
    Cadmium: 3,
  };

  // Build rows from site JSON (fallbacks handled)
  const latitude = site?.location?.lat;
  const longitude = site?.location?.lon;
  const hpi = site?.latestTest?.HPI;
  const hei = site?.latestTest?.HEI;
  const metals = Array.isArray(site?.latestTest?.metals)
    ? site.latestTest.metals
    : [];

  const rows = [];
  rows.push({ parameter: "Latitude", value: latitude, isHazard: false });
  rows.push({ parameter: "Longitude", value: longitude, isHazard: false });
  if (typeof hpi === "number")
    rows.push({ parameter: "HPI", value: hpi, isHazard: false });
  if (typeof hei === "number")
    rows.push({ parameter: "HEI", value: hei, isHazard: false });

  metals.slice(0, 8).forEach((m) => {
    rows.push({
      parameter: m.metal,
      value: m.values,
      unit: "",
      isHazard: true,
    });
  });

  const determineColor = (param, concentration) => {
    const limit = LIMITS[param];
    if (!limit) return "text-gray-900";

    const percentage = (concentration / limit) * 100;

    if (percentage <= 100) return "text-green-600 font-bold";
    if (percentage < 150) return "text-yellow-400 font-bold";
    return "text-red-600 font-bold";
  };

  const getDisplayValue = (item) => {
    if (!item.isHazard) return item.value ?? "—";
    const concentration = Number(item.value);
    if (isNaN(concentration)) return "—";
    return concentration;
  };

  return (
    <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-xl shadow-md">
      <h4 className="text-md font-bold text-gray-800 border-b pb-1">
        {(() => {
          const name = site?.siteArea || site?.siteCode;
          const code = site?.siteCode ? ` (Site No: ${site.siteCode})` : "";
          return name ? `${name}${code}` : "Selected Area";
        })()}
      </h4>
      <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-sm">
        {rows.map((item, index) => {
          const colorClass = item.isHazard
            ? determineColor(item.parameter, item.value)
            : "text-gray-900";

          return (
            <React.Fragment key={index}>
              <div className="font-semibold text-gray-700">
                {item.parameter}:
              </div>
              <div className={`text-right ${colorClass}`}>
                {getDisplayValue(item)}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
        *Values show concentration and percentage of the permissible limit.
      </p>
    </div>
  );
};

export default function Maps() {
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [selectedSite, setSelectedSite] = useState(null);
  const [allSites, setAllSites] = useState([]);
  const [sitesLoading, setSitesLoading] = useState(false);

  // Fetch all sites on component mount
  useEffect(() => {
    fetchAllSites("");
  }, []);

  // Fetch sites for the given state
const fetchAllSites = async (stateName) => {
  setSitesLoading(true);
  try {
    if (!stateName) {
      setAllSites([]);
      setSitesLoading(false);
      return;
    }
    const url = `/api/data/map/${stateName}`;
    const response = await axiosInstance.get(url);

    console.log("Site API response:", response.data);
    
    if (response.data && response.data.sites) {
      setAllSites(response.data.sites);
    } else {
      setAllSites([]);
    }
  } catch (error) {
    setAllSites([]);
  } finally {
    setSitesLoading(false);
    setHasSubmitted(true);
    setSubmitCount((c) => c + 1);
  }
};


  // Handle state change and fetch sites immediately
  const handleStateChange = async (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);

    const state = statesData.states.find((s) => s.name === stateName);
    if (state) {
      setDistricts(state.districts);
      setSelectedDistrict("");
    } else {
      setDistricts([]);
      setSelectedDistrict("");
    }

    setHasSubmitted(false);
    await fetchAllSites(stateName);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setHasSubmitted(false);
  };

  const rightSidebarContent =
    hasSubmitted || selectedSite ? (
      <DataParametersGrid site={selectedSite} />
    ) : (
      <p className="text-gray-500 italic">
        Select a district for detailed data parameters with hazards included in
        it.
      </p>
    );

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[75vh]">
      {/* Map Section */}
      <div
        className="flex-1 bg-white border border-gray-200 rounded-xl shadow-lg "
        style={{ minHeight: "600px" }}
      >
        <div className="flex justify-between items-center p-2">
          <h2 className="font-semibold text-gray-800 mt-1">
            Map:{" "}
            <span className="text-indigo-600">
              {selectedState || "Select a site"}
            </span>
          </h2>
          <label className="block font-semibold mt-1">State/UTs</label>
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="border rounded-md p-2"
          >
            <option value="">Select State</option>
            {statesData.states.map((state) => (
              <option key={state.id} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <ChoroplethMap
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          submitCount={submitCount}
          allSites={allSites}
          sitesLoading={sitesLoading}
          onSiteSelect={(site) => {
            setSelectedSite(site);
            setHasSubmitted(true);
          }}
          onBackToStates={() => {
            setSelectedState("");
            setDistricts([]);
            setSelectedDistrict("");
            setHasSubmitted(false);
            setSubmitCount(0);
          }}
        />
      </div>

      {/* Right Sidebar */}
      <div className="lg:w-1/4 p-4 bg-white border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">Data Parameters</h3>
        {sitesLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2Icon className="animate-spin mr-2" />
            <span>Loading sites...</span>
          </div>
        ) : (
          rightSidebarContent
        )}
      </div>
    </div>
  );
}
