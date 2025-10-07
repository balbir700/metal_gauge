import React from "react";
import BarGraph from "@/contents/Bargraph"; // Ensure file is BarGraph.jsx
import axiosInstance from "@/utils/axiosInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Panel({ active, siteData, aiData, dataSource }) {
  if (!siteData) return <p className="text-gray-600">Loading data...</p>;

  // Normalize source data: CSV flow has metals at root; manual flow has latestTest with metals and findings
  const isManual = dataSource === "manual";
  const latestTest = isManual ? siteData?.latestTest : null;
  const metals = isManual
    ? Array.isArray(latestTest?.metals)
      ? latestTest.metals
      : []
    : Array.isArray(siteData.metals)
    ? siteData.metals
    : [];

  // Helper: case-insensitive find for a property name on an object
  const findKeyCI = (obj = {}, candidates = []) => {
    const keys = Object.keys(obj || {});
    for (const c of candidates) {
      const exact = keys.find((k) => k.toLowerCase() === c.toLowerCase());
      if (exact) return exact;
    }
    // fallback: partial match
    for (const k of keys) {
      for (const c of candidates) {
        if (k.toLowerCase().includes(c.toLowerCase())) return k;
      }
    }
    return undefined;
  };

  const toNumber = (v) => {
    if (v === null || v === undefined) return NaN;
    if (typeof v === "number") return v;
    const s = String(v)
      .replace(/,/g, "")
      .match(/-?\d+(\.\d+)?/);
    return s ? parseFloat(s[0]) : NaN;
  };

  const key = String(active || "")
    .trim()
    .toLowerCase();

  // Only the 4 valid metrics now
  const metricCandidates = {
    "geoaccumulation index": ["Igeo", "igeo", "IGeo", "i_geo"],
    "contamination factor": [
      "CF",
      "cf",
      "contaminationFactor",
      "contamination_factor",
    ],
    "enrichment factor": ["EF", "ef", "enrichmentFactor"],
    "ecological risk index": [
      "ERI",
      "RI",
      "eri",
      "riskIndex",
      "EcologicalRiskIndex",
    ],
  };

  const findingsMap = isManual
    ? {
        "geoaccumulation index": latestTest?.igeo_Finding || null,
        "contamination factor": latestTest?.cf_Finding || null,
        "enrichment factor": latestTest?.ef_Finding || null,
        "ecological risk index": latestTest?.eri_Finding || null,
      }
    : {
        "geoaccumulation index": aiData?.igeo_Finding || null,
        "contamination factor": aiData?.cf_Finding || null,
        "enrichment factor": aiData?.ef_Finding || null,
        "ecological risk index": aiData?.eri_Finding || null,
      };

  // ✅ Always decide what to show in Key Findings
  let findingText;
  if (findingsMap[key]) {
    findingText = (
      <p className="text-base leading-relaxed text-gray-800">
        {findingsMap[key]}
      </p>
    );
  } else if (
    (isManual && latestTest?.siteInterpretation) ||
    (aiData && aiData.siteInterpretation)
  ) {
    findingText = (
      <p className="text-base leading-relaxed text-blue-800">
        {isManual ? latestTest?.siteInterpretation : aiData.siteInterpretation}
      </p>
    );
  } else if (!isManual && siteData.aiError) {
    findingText = (
      <p className="text-base leading-relaxed text-gray-500 italic">
        AI insights unavailable. Please try again later.
      </p>
    );
  } else {
    findingText = (
      <div className="flex items-center gap-2 text-gray-500 animate-pulse">
        <svg
          className="w-5 h-5 animate-spin text-gray-400"
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
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
          />
        </svg>
        Analyzing graph…
      </div>
    );
  }

  const candidates = metricCandidates[key] || [];
  const sample = metals[0] || {};
  const detectedProp = findKeyCI(sample, candidates) || candidates[0];

  const graphData = metals.map((m) => {
    const metalName =
      m.metal ?? m.Metal ?? m.name ?? Object.values(m)[0] ?? "unknown";
    const raw = m[detectedProp];
    return {
      metal: metalName,
      value: toNumber(raw),
      _raw: raw,
    };
  });

  switch (key) {
    case "geoaccumulation index":
      return (
        <BarGraph
          title="Geoaccumulation Index"
          data={graphData}
          xKey="metal"
          yKey="value"
          explanation={findingText}
        />
      );

    case "contamination factor":
      return (
        <BarGraph
          title="Contamination Factor"
          data={graphData}
          xKey="metal"
          yKey="value"
          explanation={findingText}
        />
      );

    case "enrichment factor":
      return (
        <BarGraph
          title="Enrichment Factor"
          data={graphData}
          xKey="metal"
          yKey="value"
          explanation={findingText}
        />
      );

    case "ecological risk index":
      return (
        <BarGraph
          title="Ecological Risk Index"
          data={graphData}
          xKey="metal"
          yKey="value"
          explanation={findingText}
        />
      );

    case "timeline graph": {
      const TimelineChart = ({ siteCode }) => {
        const [series, setSeries] = React.useState([]);
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState(null);

        React.useEffect(() => {
          if (!siteCode) return;
          setLoading(true);
          setError(null);
          axiosInstance
            .get(`/api/data/timeline/${siteCode}`)
            .then((resp) => {
              const grouped = resp?.data?.timeline || {};
              const points = Object.values(grouped)
                .flat()
                .map((t) => ({
                  date: new Date(t.date).toISOString().slice(0, 10),
                  HPI: typeof t.HPI === "number" ? t.HPI : null,
                  HEI: typeof t.HEI === "number" ? t.HEI : null,
                }))
                .sort((a, b) =>
                  a.date < b.date ? -1 : a.date > b.date ? 1 : 0
                );
              setSeries(points);
            })
            .catch((e) => setError(e?.message || "Failed to load timeline"))
            .finally(() => setLoading(false));
        }, [siteCode]);

        if (loading) return <p className="text-gray-600">Loading timeline…</p>;
        if (error) return <p className="text-red-600">{String(error)}</p>;
        if (!series.length)
          return <p className="text-gray-600">No timeline data.</p>;

        return (
          <div className="w-full h-full flex flex-col items-center justify-start bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">HPI/HEI Timeline</h2>
            <div className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={series}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="HPI"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="HEI"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      };

      const siteCode = siteData?.siteCode;
      return <TimelineChart siteCode={siteCode} />;
    }

    default:
      return <p className="text-gray-600">Select a graph type</p>;
  }
}

export default Panel;
