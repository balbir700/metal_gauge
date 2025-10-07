import React from "react";
import {
  AlertTriangle,
  Upload,
  BarChart,
  Droplets,
  ShieldAlert,
} from "lucide-react";

function RightSidebarPlaceholder() {
  return (
    <div
      className="flex flex-col h-full max-h-[100vh] w-full max-w-[400px] lg:max-w-[360px] md:max-w-[320px] sm:max-w-full 
      p-5 md:p-4 sm:p-3 rounded-2xl shadow-xl border-2 border-[#1A3D63]/10 overflow-y-auto mx-auto"
      style={{
        background: "color-mix(in sRGB, var(--card) 92%, transparent)",
      }}
    >
      {/* Header Section with Icon */}
      <div className="mb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A3D63] to-[#4A7FA7] rounded-2xl blur-xl opacity-30"></div>
            {/* Icon container */}
            <div className="relative flex items-center justify-center w-14 h-14 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-[#1A3D63] to-[#0A1931] shadow-2xl">
              <Droplets
                className="w-7 h-7 md:w-6 md:h-6 text-white"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl md:text-xl sm:text-lg font-bold text-[#0A1931] mb-2 tracking-tight leading-snug">
          Metals in Groundwater
        </h2>

        {/* Subtitle */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <ShieldAlert className="w-4 h-4 text-[#1A3D63]" />
          <p className="text-[#4A7FA7] font-semibold text-xs md:text-[11px] uppercase tracking-wide text-center">
            Health & Safety Monitoring
          </p>
        </div>

        {/* Divider */}
        <div className="h-1 w-24 md:w-20 bg-gradient-to-r from-[#1A3D63] via-[#4A7FA7] to-[#B3CFE5] rounded-full mx-auto"></div>
      </div>

      {/* Explanation Section */}
      <div className="mb-4 p-4 md:p-3 bg-gradient-to-br from-[#EEF6FB] to-[#E3F2FD] rounded-xl border border-[#B3CFE5]/30 shadow-md">
        <p className="text-[#0A1931] text-sm md:text-xs leading-relaxed">
          Heavy metals in groundwater can seriously affect{" "}
          <span className="font-bold text-[#1A3D63]">human health</span> and{" "}
          <span className="font-bold text-[#1A3D63]">environmental safety</span>
          . Long-term exposure may lead to severe health issues, so monitoring
          and quick analysis are vital to ensure clean and safe drinking water.
        </p>
      </div>

      {/* How it works section */}
      <div className="flex-1 bg-gradient-to-br from-white to-[#EEF6FB] border-2 border-[#1A3D63]/20 rounded-2xl p-4 md:p-3 shadow-lg min-h-0 overflow-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 md:w-6 md:h-6 rounded-lg bg-gradient-to-br from-[#1A3D63] to-[#0A1931] flex items-center justify-center">
            <BarChart className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <p className="font-bold text-[#0A1931] text-base md:text-sm">
            How This Tool Works
          </p>
        </div>

        <ul className="space-y-3 md:space-y-2">
          <li className="flex items-start gap-3 group">
            <div className="flex-shrink-0 w-8 h-8 md:w-7 md:h-7 rounded-xl bg-gradient-to-br from-[#1A3D63] to-[#0A1931] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <p className="text-[#0A1931] text-sm md:text-xs font-medium leading-relaxed">
              Upload groundwater data via CSV or manual form
            </p>
          </li>

          <li className="flex items-start gap-3 group">
            <div className="flex-shrink-0 w-8 h-8 md:w-7 md:h-7 rounded-xl bg-gradient-to-br from-[#4A7FA7] to-[#1A3D63] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <p className="text-[#0A1931] text-sm md:text-xs font-medium leading-relaxed">
              Data is compared with global health standards
            </p>
          </li>

          <li className="flex items-start gap-3 group">
            <div className="flex-shrink-0 w-8 h-8 md:w-7 md:h-7 rounded-xl bg-gradient-to-br from-[#B3CFE5] to-[#4A7FA7] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <BarChart className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <p className="text-[#0A1931] text-sm md:text-xs font-medium leading-relaxed">
              Interactive graphs show contamination trends
            </p>
          </li>
        </ul>
      </div>

      {/* Bottom Info Badge */}
      <div className="mt-4 pt-3 border-t-2 border-[#1A3D63]/10">
        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#1A3D63] to-[#4A7FA7] animate-pulse"></div>
          <p className="text-xs md:text-[11px] text-[#4A7FA7] font-semibold tracking-wide">
            Real-time Analysis • Instant Results
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#4A7FA7] to-[#B3CFE5] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default RightSidebarPlaceholder;
