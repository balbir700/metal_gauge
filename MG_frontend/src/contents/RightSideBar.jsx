// src/components/RightSideBar.jsx
import React, { useEffect, useState } from "react";
import {
  Database,
  FileText,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Target,
  Activity,
} from "lucide-react";

function RightSideBar({ siteData, aiData = {}, dataSource }) {
  const [expandTable, setExpandTable] = useState(false);
  const [expandPolicy, setExpandPolicy] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setExpandTable(false);
        setExpandPolicy(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!siteData) return null;
  const isManual = dataSource === "manual";
  const latestTest = isManual ? siteData?.latestTest : null;
  const metals = isManual
    ? Array.isArray(latestTest?.metals)
      ? latestTest.metals
      : []
    : Array.isArray(siteData.metals)
    ? siteData.metals
    : [];
  const latitude = siteData?.lat ?? siteData?.location?.lat ?? "—";
  const longitude = siteData?.lon ?? siteData?.location?.lon ?? "—";

  // Get HPI and HEI values
  const hpi = isManual ? latestTest?.HPI : siteData?.HPI;
  const hei = isManual ? latestTest?.HEI : siteData?.HEI;

  // Get baseline prediction
  const baselinePrediction = isManual
    ? latestTest?.baselinePrediction
    : aiData?.baselinePrediction;

  const normalizeName = (name = "") => String(name).toLowerCase().trim();

  // Thresholds mapped for both element symbols and full names
  const thresholds = {
    pb: 0.01,
    lead: 0.01,
    cd: 0.003,
    cadmium: 0.003,
    hg: 0.006,
    mercury: 0.006,
    as: 0.01,
    arsenic: 0.01,
    cr: 0.05,
    chromium: 0.05,
    ni: 0.07,
    nickel: 0.07,
    cu: 2.0,
    copper: 2.0,
    zn: 3.0,
    zinc: 3.0,
    mn: 0.5,
    manganese: 0.5,
    fe: 0.3,
    iron: 0.3,
  };

  const parseValueToMgL = (val) => {
    if (val === null || val === undefined) return NaN;
    if (typeof val === "number") return val;
    const raw = String(val).trim().toLowerCase();
    if (raw === "" || raw === "nd" || raw === "n.d." || raw === "na")
      return NaN;
    const cleaned = raw.replace(/[<>≈~]/g, "").trim();
    const m = cleaned.match(/-?\d+(\.\d+)?/);
    if (!m) return NaN;
    const num = parseFloat(m[0]);
    if (
      cleaned.includes("µg") ||
      cleaned.includes("ug") ||
      cleaned.includes("ppb")
    ) {
      return num / 1000;
    }
    return num;
  };

  const getRisk = (metalName, rawValue) => {
    const key = normalizeName(metalName);
    const mg = parseValueToMgL(rawValue);
    const limit = thresholds[key];
    if (isNaN(mg) || limit === undefined) {
      return {
        dot: "bg-gray-300",
        textClass: "text-gray-600",
        label: "Unknown",
      };
    }
    if (mg > limit)
      return { dot: "bg-red-500", textClass: "text-red-600", label: "Risky" };
    if (mg > limit * 0.7)
      return {
        dot: "bg-orange-400",
        textClass: "text-orange-600",
        label: "Moderate",
      };
    return { dot: "bg-green-500", textClass: "text-green-600", label: "Safe" };
  };

  // Helper function to parse prediction data into table format
  const parsePredictionData = (dataString) => {
    if (!dataString || typeof dataString !== "string") return [];

    // Split by comma to get individual metal entries
    const items = dataString
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return items.map((item) => {
      // Split by colon to separate metal name and value
      if (item.includes(":")) {
        const colonIndex = item.indexOf(":");
        const metal = item.substring(0, colonIndex).trim();
        const value = item.substring(colonIndex + 1).trim();
        return { metal, value };
      }
      // Fallback for other formats
      else if (item.includes("=")) {
        const [metal, value] = item.split("=").map((s) => s.trim());
        return { metal: metal || "—", value: value || "—" };
      } else {
        return { metal: "—", value: item };
      }
    });
  };

  // Show 3 metals preview by default, expand to all
  const previewMetals = expandTable ? metals : metals.slice(0, 3);

  // Get raw prediction strings
  const policyPredictionString = isManual
    ? latestTest?.withPolicyPrediction
    : aiData?.withPolicyPrediction;
  const baselinePredictionString = baselinePrediction;

  // Parse prediction data for tables
  const policyPredictionData = parsePredictionData(policyPredictionString);
  const baselinePredictionData = parsePredictionData(baselinePredictionString);

  return (
    <div
      className="relative w-full h-screen flex flex-col gap-6 overflow-hidden"
      style={{ maxHeight: "100vh" }}
    >
      {/* ---------------- Data Parameters ---------------- */}

      <div
        className="rounded-xl p-4 flex flex-col border-2 border-blue-200 flex-[0.48] overflow-y-auto"
        style={{
          background: "color-mix(in sRGB, var(--card) 92%, transparent)",
        }}
      >
        {/* Enhanced Heading */}
        <div className="mb-4">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-300">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#1A3D63] to-[#0A1931] shadow-md">
              <Database className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-[#0A1931] tracking-tight">
              Data Parameters
            </h2>
            <div className="h-1.5 w-1.5 rounded-full bg-[#4A7FA7] ml-1"></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
          {/* Latitude */}
          <div
            className="flex justify-between items-center rounded-lg px-3 py-2 shadow-sm"
            style={{ background: "#EEF6FB" }}
          >
            <span className="font-medium text-black">Latitude</span>
            <span className="text-black">{latitude}</span>
          </div>

          {/* Longitude */}
          <div
            className="flex justify-between items-center rounded-lg px-3 py-2 shadow-sm"
            style={{ background: "#EEF6FB" }}
          >
            <span className="font-medium text-black">Longitude</span>
            <span className="text-black">{longitude}</span>
          </div>

          {/* HPI */}
          <div
            className="flex justify-between items-center rounded-lg px-3 py-2 shadow-sm"
            style={{ background: "#EEF6FB" }}
          >
            <span className="font-medium text-black">HPI</span>
            <span className="text-blue-700 font-semibold">{hpi || "—"}</span>
          </div>

          {/* HEI */}
          <div
            className="flex justify-between items-center rounded-lg px-3 py-2 shadow-sm"
            style={{ background: "#EEF6FB" }}
          >
            <span className="font-medium text-black">HEI</span>
            <span className="text-blue-700 font-semibold">{hei || "—"}</span>
          </div>

          {/* Metals */}
          {previewMetals.map((item, idx) => {
            const risk = getRisk(item.metal, item.values);
            return (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 shadow-sm"
                title={risk.label}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${risk.dot}`} />
                  <span className="font-medium text-gray-800">
                    {item.metal}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`${risk.textClass} font-medium`}>
                    {`${item.values ?? "—"} mg/L`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span>Risky</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-400" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span>Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-300" />
              <span>Unknown</span>
            </div>
          </div>

          {metals.length > 3 && (
            <button
              onClick={() => setExpandTable((s) => !s)}
              className="mt-2 inline-block px-3 py-1 text-sm text-blue-600 rounded hover:underline"
            >
              {expandTable ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      </div>

      {/* ---------------- Policy Recommendation ---------------- */}
      <div
        className="flex-1 min-h-0 rounded-xl border-2 border-blue-200 p-4 flex flex-col"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(238,246,251,0.95) 100%)",
        }}
      >
        <div className="mb-4 pb-3 border-b-2 border-blue-300 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0A1931] rounded-lg flex items-center justify-center shadow-md">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0A1931] tracking-tight">
              Policy Recommendation &amp; Impact
            </span>
          </h2>
          <p className="text-sm text-gray-600 mt-1 ml-12">
            Critical insights and strategic policy guidance
          </p>
        </div>

        {!(isManual
          ? latestTest?.siteInterpretation
          : aiData?.siteInterpretation) ? (
          <div className="flex items-center justify-center flex-1 text-gray-500 text-sm">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="font-medium text-gray-700">
              Analyzing site impact...
            </span>
          </div>
        ) : (
          <>
            <div className="text-gray-800 text-sm overflow-y-auto flex-1 min-h-0 flex flex-col gap-4 pr-2">
              <div
                className="rounded-xl shadow-lg p-4 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #EEF6FB 0%, #E3F2FD 100%)",
                }}
              >
                <h3 className="font-bold text-base mb-3 text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 text-blue-500 mr-2" />
                  Interpretation
                </h3>
                <p className="text-gray-800 leading-relaxed font-medium">
                  {(isManual
                    ? latestTest?.siteInterpretation
                    : aiData?.siteInterpretation) || "—"}
                </p>
              </div>
              <div
                className="rounded-xl shadow-lg p-4 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #FFF4E6 0%, #FFE8CC 100%)",
                }}
              >
                <h3 className="font-bold text-base mb-3 text-gray-900 flex items-center">
                  <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                  Impact
                </h3>
                <p className="text-gray-800 leading-relaxed font-medium">
                  {(isManual ? latestTest?.siteImpact : aiData?.siteImpact) ||
                    "—"}
                </p>
              </div>
              <div
                className="rounded-xl shadow-lg p-4 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #F0FFF4 0%, #E6F9ED 100%)",
                }}
              >
                <h3 className="font-bold text-base mb-3 text-gray-900 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Policy Recommendation
                </h3>
                <p className="text-gray-800 leading-relaxed font-medium">
                  {(isManual
                    ? latestTest?.policyRecommendations
                    : aiData?.policyRecommendations) || "—"}
                </p>
              </div>
              <div
                className="rounded-xl shadow-lg p-4 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
                }}
              >
                <h3 className="font-bold text-base mb-3 text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                  Effect of Policy
                </h3>
                <p className="text-gray-800 leading-relaxed font-medium">
                  {(isManual
                    ? latestTest?.effectOfPolicy
                    : aiData?.effectOfPolicy) || "—"}
                </p>
              </div>

              {/* Policy Prediction Table */}
              <div
                className="rounded-xl shadow-lg p-4 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
                }}
              >
                <h3 className="font-bold text-base mb-3 text-gray-900 flex items-center">
                  <Target className="w-5 h-5 text-indigo-500 mr-2" />
                  Estimated Levels Post-Intervention
                </h3>
                {policyPredictionData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-indigo-100 border-b-2 border-indigo-300">
                          <th className="text-left py-2 px-3 font-semibold text-gray-800">
                            Metal
                          </th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-800">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {policyPredictionData.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-indigo-100 hover:bg-indigo-50 transition-colors"
                          >
                            <td className="py-2 px-3 font-medium text-gray-800">
                              {row.metal}
                            </td>
                            <td className="py-2 px-3 text-gray-700">
                              {`${row.value} mg/L`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">—</p>
                )}
              </div>

              {/* Baseline Prediction Table */}
              <div
                className="rounded-xl shadow-lg p-4 border-l-4 border-teal-500 hover:shadow-xl transition-shadow duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)",
                }}
              >
                <h3 className="font-bold text-base mb-3 text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 text-teal-500 mr-2" />
                  Pollution Estimates (Current Conditions)
                </h3>
                {baselinePredictionData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-teal-100 border-b-2 border-teal-300">
                          <th className="text-left py-2 px-3 font-semibold text-gray-800">
                            Metal
                          </th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-800">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {baselinePredictionData.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-teal-100 hover:bg-teal-50 transition-colors"
                          >
                            <td className="py-2 px-3 font-medium text-gray-800">
                              {row.metal}
                            </td>
                            <td className="py-2 px-3 text-gray-700">
                              {`${row.value} mg/L`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">—</p>
                )}
              </div>
            </div>

            <div className="mt-3">
              <button
                onClick={() => setExpandPolicy(true)}
                className="inline-block px-3 py-1 text-sm text-blue-600 rounded hover:underline"
              >
                Read More
              </button>
            </div>
          </>
        )}
      </div>

      {/* ---------------- Policy Panel (expanded) ---------------- */}
      {expandPolicy && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1" onClick={() => setExpandPolicy(false)} />
          <div
            className="w-3/4 max-w-[75vw] h-[calc(100vh-60px)] mt-[60px] p-6 shadow-2xl overflow-y-auto rounded-l-2xl"
            style={{
              background: "color-mix(in sRGB, var(--card) 92%, transparent)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-blue-300">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  {/* Icon on the left */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>

                  {/* Text + Image wrapper */}
                  <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      Policy Recommendation &amp; Impact
                    </span>

                    <div className="pl-8 flex items-center ">
                      <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent tracking-wide">
                        Powered by
                      </span>

                      <img
                        src="/images/geminii.png"
                        alt="Gemini logo"
                        className="h-35 w-auto object-contain pt-7"
                      />
                    </div>
                  </div>
                </h2>

                <p className="text-gray-600 ml-16">
                  Comprehensive analysis of policy strategies and their
                  projected outcomes
                </p>
              </div>
              <button
                onClick={() => setExpandPolicy(false)}
                className="text-gray-500 hover:text-red-600 transition-colors duration-200"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Interpretation Box */}
            <div
              className="rounded-xl shadow-lg p-5 mb-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-200"
              style={{
                background: "linear-gradient(135deg, #EEF6FB 0%, #E3F2FD 100%)",
              }}
            >
              <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                <FileText className="w-6 h-6 text-blue-500 mr-3" />
                Interpretation
              </h3>
              <p className="text-gray-800 leading-relaxed font-medium">
                {(isManual
                  ? latestTest?.siteInterpretation
                  : aiData?.siteInterpretation) || "—"}
              </p>
            </div>

            {/* Impact Box */}
            <div
              className="rounded-xl shadow-lg p-5 mb-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-200"
              style={{
                background: "linear-gradient(135deg, #FFF4E6 0%, #FFE8CC 100%)",
              }}
            >
              <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                <AlertCircle className="w-6 h-6 text-orange-500 mr-3" />
                Impact
              </h3>
              <p className="text-gray-800 leading-relaxed font-medium">
                {(isManual ? latestTest?.siteImpact : aiData?.siteImpact) ||
                  "—"}
              </p>
            </div>

            {/* Policy Box */}
            <div
              className="rounded-xl shadow-lg p-5 mb-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-200"
              style={{
                background: "linear-gradient(135deg, #F0FFF4 0%, #E6F9ED 100%)",
              }}
            >
              <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                Policy Recommendation
              </h3>
              <p className="text-gray-800 leading-relaxed font-medium">
                {(isManual
                  ? latestTest?.policyRecommendations
                  : aiData?.policyRecommendations) || "—"}
              </p>
            </div>

            {/* Effect of Policy Box */}
            <div
              className="rounded-xl shadow-lg p-5 mb-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-200"
              style={{
                background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
              }}
            >
              <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                <TrendingUp className="w-6 h-6 text-purple-500 mr-3" />
                Effect of Policy
              </h3>
              <p className="text-gray-800 leading-relaxed font-medium">
                {(isManual
                  ? latestTest?.effectOfPolicy
                  : aiData?.effectOfPolicy) || "—"}
              </p>
            </div>

            {/* Policy Prediction Box - Expanded */}
            <div className="flex gap-4">
              <div
                className=" flex-1 h-[550px] rounded-xl shadow-lg p-5 mb-6 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
                }}
              >
                <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                  <Target className="w-6 h-6 text-indigo-500 mr-3" />
                  Estimated Levels Post-Intervention
                </h3>
                {policyPredictionData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-indigo-100 border-b-2 border-indigo-300">
                          <th className="text-left py-3 px-4 font-semibold text-gray-800">
                            Metal
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-800">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {policyPredictionData.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-indigo-100 hover:bg-indigo-50 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium text-gray-800">
                              {row.metal}
                            </td>
                            <td className="py-2 px-3 text-gray-700">
                              {`${row.value} mg/L`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">—</p>
                )}
              </div>

              {/* Baseline Prediction Box - Expanded */}
              <div
                className=" flex-1 h-[550px] rounded-xl shadow-lg p-5 border-l-4 border-teal-500 hover:shadow-xl transition-shadow duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)",
                }}
              >
                <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                  <Activity className="w-6 h-6 text-teal-500 mr-3" />
                  Pollution Estimates (Current Conditions)
                </h3>
                {baselinePredictionData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-teal-100 border-b-2 border-teal-300">
                          <th className="text-left py-3 px-4 font-semibold text-gray-800">
                            Metal
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-800">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {baselinePredictionData.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-teal-100 hover:bg-teal-50 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium text-gray-800">
                              {row.metal}
                            </td>
                            <td className="py-2 px-3 text-gray-700">
                              {`${row.value} mg/L`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">—</p>
                )}
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6">
              <button
                onClick={() => setExpandPolicy(false)}
                className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RightSideBar;
