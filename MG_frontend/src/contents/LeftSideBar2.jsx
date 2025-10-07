import React, { useState } from "react";
import { MapPin, Building2, Hash, Upload, Database } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

function LeftSideBar2({ setGraphData, setStatus, setDataSource }) {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [siteId, setSiteId] = useState("");

  const handleUpload = async () => {
    try {
      setStatus("loading");
      setDataSource && setDataSource("manual");
      // send manual inputs

      // fetch processed graph data
      const response = await axiosInstance.get("/api/data/site/" + siteId);
      // Assume API returns the single object for manual flow
      setGraphData(response.data);
      setStatus("success");
    } catch (error) {
      console.error("Error uploading manual input:", error);
      setStatus("idle");
    }
  };

  return (
    <div
      className="rounded-2xl shadow-xl p-8 w-full h-full flex flex-col"
      style={{ background: "color-mix(in sRGB, var(--card) 92%, transparent)" }}
    >
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 pb-4 border-b-2 border-[#1A3D63]/20">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#1A3D63] to-[#0A1931] shadow-lg">
            <Database className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0A1931] tracking-tight">
              Enter Data Manually
            </h2>
            <p className="text-sm text-[#4A7FA7] mt-1">
              Fill in the location details
            </p>
          </div>
        </div>
      </div>

      {/* Form Section - Flex grow to take available space */}
      <div className="flex-1 flex flex-col gap-6">
        {/* State Input */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 font-semibold text-[#0A1931]">
            <MapPin className="w-4 h-4 text-[#1A3D63]" />
            State
          </label>
          <div className="relative">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border-2 rounded-xl p-4 pr-10 font-medium text-[#0A1931] transition-all duration-200 focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/20 focus:outline-none appearance-none cursor-pointer"
              style={{ borderColor: "var(--border)", background: "#EEF6FB" }}
            >
              <option value="">Select State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              {/* add more states */}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-[#1A3D63]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* District Input */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 font-semibold text-[#0A1931]">
            <Building2 className="w-4 h-4 text-[#1A3D63]" />
            District
          </label>
          <div className="relative">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full border-2 rounded-xl p-4 pr-10 font-medium text-[#0A1931] transition-all duration-200 focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/20 focus:outline-none appearance-none cursor-pointer"
              style={{ borderColor: "var(--border)", background: "#EEF6FB" }}
            >
              <option value="">Select District</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              {/* add more */}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-[#1A3D63]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Site ID Input */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 font-semibold text-[#0A1931]">
            <Hash className="w-4 h-4 text-[#1A3D63]" />
            Site ID
          </label>
          <input
            type="text"
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="w-full border-2 rounded-xl p-4 font-medium text-[#0A1931] transition-all duration-200 focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/20 focus:outline-none"
            style={{ borderColor: "var(--border)", background: "#EEF6FB" }}
            placeholder="Enter Site ID (eg: PN-001)"
          />
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-gradient-to-r from-[#1A3D63] to-[#0A1931] text-white rounded-xl py-4 font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
        >
          <Upload className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform duration-300" />
          Upload
        </button>
      </div>

      {/* Info Footer */}
      <div className="mt-6 pt-4 border-t border-[#1A3D63]/10">
        <p className="text-xs text-[#4A7FA7] text-center">
          Ensure all fields are filled correctly before uploading
        </p>
      </div>
    </div>
  );
}

export default LeftSideBar2;
