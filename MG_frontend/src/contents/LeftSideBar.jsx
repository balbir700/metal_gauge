import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";

function LeftSideBar({ active, setActive, siteData, aiData = {}, dataSource }) {
  const [open, setOpen] = useState(false);

  const graphTypes = [
    "Geoaccumulation Index",
    "Contamination Factor",
    "Enrichment Factor",
    "Ecological Risk Index",
    "Timeline Graph",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const generatePDF = () => {
    if (!siteData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPos = 20;

    const addText = (text, x, y, fontSize = 12, bold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, bold ? "bold" : "normal");
      doc.text(text, x, y);
      return y + fontSize * 0.5;
    };

    const addWrappedText = (text, x, y, width = 170, fontSize = 11) => {
      const lines = doc.splitTextToSize(text, width);
      doc.text(lines, x, y);
      return y + lines.length * fontSize * 0.55;
    };

    const addSection = (title) => {
      yPos = addText(title, 20, yPos, 15, true);
      yPos += 5;
    };

    const addRow = (label, value) => {
      doc.setFontSize(11);
      doc.text(`${label}:`, 20, yPos);
      doc.text(`${value}`, 110, yPos);
      yPos += 8;
    };

    const checkPage = () => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }
    };

    // --- Report content ---
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("Site Analysis Report", pageWidth / 2, 15, { align: "center" });
    doc.setFont(undefined, "normal");

    yPos += 10;
    addSection("Site Information");
    addRow("Site Area", siteData?.siteArea || "N/A");
    addRow("State", siteData?.State || "N/A");
    addRow("Site Code", siteData?.siteCode || "N/A");
    addRow("Latitude", siteData?.lat || siteData?.location?.lat || "N/A");
    addRow("Longitude", siteData?.lon || siteData?.location?.lon || "N/A");

    yPos += 5;
    checkPage();

    addSection("Risk Assessment Indices");
    const isManual = dataSource === "manual";
    const latest = isManual ? siteData?.latestTest : null;
    const HPI = isManual ? latest?.HPI : siteData?.HPI;
    const HEI = isManual ? latest?.HEI : siteData?.HEI;

    addRow("HPI (Heavy Metal Pollution Index)", HPI || "N/A");
    addRow("HEI (Heavy Metal Evaluation Index)", HEI || "N/A");

    yPos += 5;
    checkPage();

    addSection("Heavy Metal Concentrations");

    const metals = isManual
      ? Array.isArray(latest?.metals)
        ? latest.metals
        : []
      : Array.isArray(siteData?.metals)
      ? siteData.metals
      : [];

    if (metals.length > 0) {
      metals.forEach((m) => {
        checkPage();
        const fullName =
          {
            Pb: "Lead",
            Cd: "Cadmium",
            Hg: "Mercury",
            As: "Arsenic",
            Cr: "Chromium",
            Ni: "Nickel",
            Cu: "Copper",
            Zn: "Zinc",
            Mn: "Manganese",
            Fe: "Iron",
          }[m.metal] || m.metal;

        addRow(`${m.metal} (${fullName})`, `${m.values || "N/A"} mg/kg`);
      });
    } else {
      addRow("No metal data available", "—");
    }

    yPos += 8;
    checkPage();

    addSection("Analysis & Recommendations");

    const contentBlocks = [
      {
        title: "Site Interpretation",
        text: isManual
          ? latest?.siteInterpretation
          : aiData?.siteInterpretation,
      },
      {
        title: "Environmental Impact",
        text: isManual ? latest?.siteImpact : aiData?.siteImpact,
      },
      {
        title: "Policy Recommendations",
        text: isManual
          ? latest?.policyRecommendations
          : aiData?.policyRecommendations,
      },
      {
        title: "Effect of Policy",
        text: isManual ? latest?.effectOfPolicy : aiData?.effectOfPolicy,
      },
      {
        title: "Policy Prediction",
        text: isManual
          ? latest?.withPolicyPrediction
          : aiData?.withPolicyPrediction,
      },
      {
        title: "Baseline Prediction",
        text: isManual
          ? latest?.baselinePrediction
          : aiData?.baselinePrediction,
      },
    ];

    contentBlocks.forEach((block) => {
      if (block.text) {
        checkPage();
        yPos = addText(block.title, 20, yPos, 13, true);
        yPos = addWrappedText(block.text, 20, yPos + 3, pageWidth - 40);
        yPos += 5;
      }
    });

    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      20,
      pageHeight - 15
    );
    doc.text(
      "Metal Ground - Site Analysis Report",
      pageWidth - 70,
      pageHeight - 15
    );

    const fileName = `Site_Report_${siteData?.siteCode || "Unknown"}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col gap-6 overflow-hidden overflow-y-auto p-4 rounded-xl border border-blue-200
        transform transition-transform duration-500 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        
      `}
      style={{
        background: "color-mix(in sRGB, var(--card) 90%, transparent)",
        borderRight: "1px solid var(--border)",
        minWidth: "220px",
        maxHeight: "100vh",
      }}
    >
      {/* Header */}
      <h2
        className="text-center font-bold text-lg mb-4 border-b pb-2"
        style={{ color: "var(--foreground)" }}
      >
        Graph Types
      </h2>

      {/* Graph Buttons */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1">
        {graphTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActive(type)}
            className={`w-full py-2.5 px-3 rounded-lg font-medium transition text-center text-sm
              ${
                active === type
                  ? "bg-[var(--accent)] text-white shadow-md scale-[1.02]"
                  : "bg-[#EEF6FB] text-[var(--foreground)] hover:bg-[var(--muted)] hover:scale-[1.01]"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* PDF Download */}
      <div
        className="mt-3 pt-3 border-t bg-[var(--card)] sticky bottom-0 z-10"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={generatePDF}
          disabled={!siteData}
          className={`w-full py-2.5 px-3 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm
            ${
              siteData
                ? "bg-[var(--secondary)] text-white hover:bg-[var(--primary)] shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download Report (PDF)
        </button>
      </div>
    </div>
  );
}

export default LeftSideBar;
