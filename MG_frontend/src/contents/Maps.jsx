// src/contents/Maps.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [selectedSite, setSelectedSite] = useState(null);
  const [allSites, setAllSites] = useState([]);
  const [sitesLoading, setSitesLoading] = useState(false);

  // Fetch all sites on component mount
  useEffect(() => {
    fetchAllSites();
  }, []);

  const handleStateChange = (e) => {
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

    setIsSubmitting(false);
    setHasSubmitted(false);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setIsSubmitting(false);
    setHasSubmitted(false);
  };

  // Function to fetch all sites
  const fetchAllSites = async () => {
    setSitesLoading(true);
    try {
      console.log("Fetching all sites...");
      const response = await axiosInstance.get(
        `/api/data/map/${selectedState}`
      );
      console.log("Sites API response:", response.data);
      if (response.data && response.data.sites) {
        setAllSites(response.data.sites);
        console.log("All sites fetched:", response.data.sites.length, "sites");
      } else {
        console.log("No sites found in response");
      }
    } catch (error) {
      console.error("Error fetching all sites:", error);
      setAllSites([]);
    } finally {
      setSitesLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedState) {
      alert("Please select a state first");
      return;
    }

    setIsSubmitting(true);
    setHasSubmitted(false);

    try {
      if (allSites.length === 0) {
        await fetchAllSites();
      }

      const response = await axiosInstance.get(
        `/api/data/map/${selectedState}`
      );
      console.log("API Response:", response.data.site);
    } catch (error) {
      console.error("Error fetching map data:", error);
    } finally {
      setIsSubmitting(false);
      setHasSubmitted(true);
      setSubmitCount((c) => c + 1);
      console.log("Submit completed:", {
        selectedState,
        selectedDistrict,
        submitCount: submitCount + 1,
      });
    }
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
      {/* Left Sidebar */}
      <div className="lg:w-1/4 p-4 bg-white border border-gray-200 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">Filters</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">State/UTs</label>
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select State</option>
              {statesData.states.map((state) => (
                <option key={state.id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="w-full border rounded-md p-2"
              disabled={!districts.length}
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            {isSubmitting ? (
              <Button size="sm" disabled className="w-full">
                <Loader2Icon className="animate-spin mr-2" />
                Please wait
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSubmit}
              >
                SUBMIT
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div
        className="flex-1 bg-white border border-gray-200 rounded-xl shadow-lg p-3"
        style={{ minHeight: "600px" }}
      >
        <ChoroplethMap
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          submitCount={submitCount}
          allSites={allSites}
          sitesLoading={sitesLoading}
          onSiteSelect={(site) => {
            console.log("Site selected:", site);
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
