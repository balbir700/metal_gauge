import React, { useState } from "react";
import LeftSideBar from "../contents/LeftSideBar";
import LeftSideBar2 from "../contents/LeftSideBar2";
import Panel from "../contents/Panel";
import Center from "../contents/Center";
import RightSideBar from "../contents/RightSideBar";
import RightSidebarPlaceholder from "../contents/RightSidebarPlaceholder";

function Graph() {
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success"
  const [activeGraph, setActiveGraph] = useState("Geoaccumulation Index");
  const [graphData, setGraphData] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [dataSource, setDataSource] = useState(null); // 'csv' | 'manual'

  // unify structure for both manual and CSV inputs
  const csvSiteData = graphData?.data?.[0];
  const unifiedSiteData =
    dataSource === "manual" ? graphData || {} : csvSiteData || {};

  return (
    <div className="flex w-full h-screen overflow-y-hidden bg-gradient-to-br from-[#F6FAFD] via-[#B3CFE5] to-[#F6FAFD]">
      {/* LEFT SIDEBAR */}
      <div className="h-full flex-1 min-w-[280px] p-2">
        {status === "success" ? (
          <LeftSideBar
            active={activeGraph}
            setActive={setActiveGraph}
            siteData={unifiedSiteData}
            aiData={aiData}
            dataSource={dataSource}
          />
        ) : (
          <LeftSideBar2
            setGraphData={setGraphData}
            setStatus={setStatus}
            setDataSource={setDataSource}
          />
        )}
      </div>

      {/* CENTER PANEL */}
      <div className="flex-[2] flex flex-col overflow-hidden p-2">
        {status === "success" && (
          <div className="flex-none">
            <Panel
              active={activeGraph}
              siteData={unifiedSiteData}
              aiData={aiData}
              dataSource={dataSource}
            />
          </div>
        )}

        <div
          className={`flex-1 flex items-center justify-center overflow-hidden rounded-xl shadow-inner backdrop-blur-sm p-4 ${
            status === "success" ? "mt-2" : ""
          }`}
        >
          {status === "loading" ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 font-medium">Uploading data...</p>
            </div>
          ) : status === "idle" ? (
            <div className="w-full flex justify-center">
              <Center
                setGraphData={setGraphData}
                setStatus={setStatus}
                setAiData={setAiData}
                setDataSource={setDataSource}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="h-full flex-1 min-w-[280px] p-2">
        {status === "success" ? (
          <RightSideBar
            aiData={aiData}
            setAiData={setAiData}
            dataSource={dataSource}
            siteData={unifiedSiteData}
          />
        ) : (
          <RightSidebarPlaceholder />
        )}
      </div>
    </div>
  );
}

export default Graph;
