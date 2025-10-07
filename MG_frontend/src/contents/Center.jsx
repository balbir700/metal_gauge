import React, { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { FiPlus, FiUpload } from "react-icons/fi";

function Center({ setGraphData, setStatus, setAiData, setDataSource }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/api/data/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      // Immediately show upload response
      const siteCode = response?.data.data[0].siteCode;
      setGraphData(response.data);
      setDataSource && setDataSource("csv");
      setStatus("success");
      console.log("Upload response:", response);

      // Trigger AI insights separately (non-blocking)
      axiosInstance
        .post(`/api/data/sites/${siteCode}/ai`, {}, { timeout: 120000 })
        .then((airesp) => {
          console.log("AI response:", airesp);
          setAiData(airesp.data.aidata);
        })
        .catch((err) => {
          console.error("AI error:", err);
        });
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setStatus("idle");
    }
  };

  return (
    <div
      className="rounded-3xl shadow-2xl p-8 w-full max-w-lg backdrop-blur-sm border border-white/20"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(238,246,251,0.95) 100%)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)",
          }}
        >
          <FiUpload className="text-white text-2xl" />
        </div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          Upload CSV File
        </h2>
        <p className="text-sm text-gray-500">
          Select a file to analyze your data
        </p>
      </div>

      {/* Dropzone */}
      <label
        className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 mb-6 hover:border-blue-400 hover:bg-blue-50/30"
        style={{
          borderColor: "var(--border)",
          background: "rgba(238, 246, 251, 0.5)",
        }}
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110"
            style={{
              background:
                "linear-gradient(135deg, rgba(74, 144, 226, 0.15) 0%, rgba(179, 207, 229, 0.25) 100%)",
            }}
          >
            <FiPlus className="text-5xl" style={{ color: "#4A90E2" }} />
          </div>
          <span
            className="text-base font-semibold mb-2"
            style={{ color: "var(--foreground)" }}
          >
            {file ? file.name : "CHOOSE A CSV FILE"}
          </span>
          <span className="text-xs text-gray-400">
            Click to browse from your device
          </span>
        </div>
        {/* Hidden native input */}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Upload Button */}
      <button
        onClick={handleFileUpload}
        className="w-full bg-gradient-to-r from-[#1A3D63] to-[#0A1931] text-white rounded-xl py-4 font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
      >
        <span className="flex items-center justify-center gap-2">
          <FiUpload className="text-lg" />
          Upload
        </span>
      </button>
    </div>
  );
}

export default Center;
