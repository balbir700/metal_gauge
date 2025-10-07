import React, { useEffect, useState } from "react";

export function DataParameters({ data }) {
  const [expandTable, setExpandTable] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setExpandTable(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!data) return null;
  const metals = Array.isArray(data.metals) ? data.metals : [];

  const normalizeName = (name = "") =>
    String(name)
      .toLowerCase()
      .replace(/\s*\(.*\)/g, "")
      .trim();

  // const toxicKeys = [
  //   "lead",
  //   "cadmium",
  //   "mercury",
  //   "arsenic",
  //   "chromium",
  //   "nickel",
  // ];
  // const toxicMetals = metals.filter((m) =>
  //   toxicKeys.includes(normalizeName(m.metal))
  // );
  const previewMetals = expandTable ? metals : metals.slice(0, 1);

  const thresholds = {
    lead: 0.01,
    cadmium: 0.003,
    mercury: 0.006,
    arsenic: 0.01,
    chromium: 0.05,
    nickel: 0.07,
    copper: 2.0,
    zinc: 3.0,
    manganese: 0.5,
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

  return (
    <div className="relative w-full h-full flex flex-col gap-6 overflow-hidden">
      {/* ---------------- Data Parameters (unchanged) ---------------- */}
      <div className="bg-white rounded-xl shadow-md p-4 flex-1 overflow-hidden flex flex-col">
        <h2 className="text-lg font-semibold mb-3 border-b pb-2">
          Data Parameters
        </h2>

        <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
          {/* Latitude */}
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 shadow-sm">
            <span className="font-medium text-black">Latitude</span>
            <span className="text-black">{data.latitude ?? "—"}</span>
          </div>

          {/* Longitude */}
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 shadow-sm">
            <span className="font-medium text-black">Longitude</span>
            <span className="text-black">{data.longitude ?? "—"}</span>
          </div>

          {/* Metals */}
          {previewMetals.map((item, idx) => {
            const risk = getRisk(item.metal, item.value);
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
                    {item.value ?? "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend + Read More */}
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

          {metals.length > 1 && (
            <button
              onClick={() => setExpandTable((s) => !s)}
              className="mt-2 inline-block px-3 py-1 text-sm text-blue-600 rounded hover:underline"
            >
              {expandTable ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataParameters;
