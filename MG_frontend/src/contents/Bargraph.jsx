// src/components/BarGraph.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function BarGraph({
  title = "",
  data,
  xKey = "metal",
  yKey = "value",
  explanation = "",
  season = "", // <-- Add season prop
}) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="text-gray-500">No data available.</div>;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
      {/* Season */}
      {season && (
        <div className="text-blue-700 font-semibold text-lg mb-2">
          Season: {season}
        </div>
      )}

      {/* Title */}
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {/* Graph */}
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xKey}
              type="category"
              tick={{ fontSize: 14 }}
              label={{ value: xKey, position: "insideBottom", offset: -5 }}
            />
            <YAxis
              type="number"
              tick={{ fontSize: 14 }}
              label={{ value: yKey, angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Bar
              dataKey={yKey}
              fill="var(--chart-1)"
              barSize={40}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Findings */}
      <div className="mt-6 w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700">
        <h3 className="text-lg font-semibold mb-2">Key Findings</h3>
        <div className="text-base leading-relaxed">
          {explanation || "No key findings provided."}
        </div>
      </div>
    </div>
  );
}

export default BarGraph;
