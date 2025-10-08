import React, { useRef, useEffect, useState } from "react";
import "@/App.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { statesData } from "@/map_data/indiaStates.js";
import dataParameters from "@/json_files/data_parameters.json";
// We'll load Maharashtra districts data dynamically to avoid bundling issues

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Helper: get color based on density
function getColor(d) {
  // Themed stepped blue scale
  return d > 7
    ? "#A64C67"
    : d > 6
    ? "#D04C67"
    : d > 5
    ? "#EB5E60"
    : d > 4
    ? "#FC8369"
    : d > 3
    ? "#FDAF76"
    : d > 2
    ? "#FEC981"
    : d > 0
    ? "#FEE49F"
    : "#FEE49F";
}

// Style each feature
function style(feature) {
  return {
    fillColor: getColor(feature.censuscode || 0),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

// Component to handle interactions
// Update ChoroplethLayer to receive allSites and color states accordingly
function ChoroplethLayer({ onStateClick, allSites }) {
  const map = useMap();
  const geoJsonRef = useRef();

  // Determine contamination level for a site (high/mid/low)
  const getContaminationLevel = (site) => {
    const hpi = site.latestTest?.HPI;
    const hei = site.latestTest?.HEI;

    if ((typeof hpi === "number" && hpi > 100) || (typeof hei === "number" && hei > 5)) {
      return "high";
    }
    if ((typeof hpi === "number" && hpi > 50) || (typeof hei === "number" && hei > 3)) {
      return "mid";
    }
    return "low";
  };

  // Map contamination category to the legend color scale number
  const contaminationColorValue = {
    high: 8,
    mid: 5,
    low: 1,
  };

  // Compute color for a state based on majority site's contamination level

const getStateFillColor = (stateName) => {
  if (!allSites || allSites.length === 0) {
    console.log("No sites data available");
    return "#FEE49F"; // default low color
  }
  

  const sitesInState = allSites.filter((site) => site.State === stateName);
  console.log(`Sites found for state ${stateName}:`, sitesInState.length);

  if (sitesInState.length === 0) return "#FEE49F";

  const counts = sitesInState.reduce(
    (acc, site) => {
      const level = getContaminationLevel(site);
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    },
    { high: 0, mid: 0, low: 0 }
  );

  console.log(`Contamination level counts for ${stateName}:`, counts);

  const maxLevel = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  );

  console.log(`Majority contamination level for ${stateName}:`, maxLevel);

  const fillColor = getColor(contaminationColorValue[maxLevel]);
  console.log(`Color chosen for ${stateName}:`, fillColor);

  return fillColor;
};


  // Override style function for GeoJSON to use fillColor from sites
  const style = (feature) => {
    const stateName = feature.properties?.ST_NM;
    const fillColor = getStateFillColor(stateName);
    return {
      fillColor,
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: 5,
          color: "#1A3D63",
          dashArray: "",
          fillOpacity: 0.7,
        });
        e.target.bringToFront();
      },
      mouseout: (e) => {
        if (geoJsonRef.current) geoJsonRef.current.resetStyle(e.target);
      },
      click: (e) => {
        map.fitBounds(e.target.getBounds());
        setTimeout(() => {
          map.setZoom(map.getZoom());
          onStateClick(feature.properties.ST_NM);
        }, 300);
      },
    });

    try {
      const name = feature.properties && feature.properties.ST_NM;
      const density = feature.censuscode;
      layer.bindPopup(
        `<b>${name || "Unknown"}</b><br/>Density: ${density ?? "N/A"}`
      );
    } catch {
      layer.bindPopup("State info");
    }
  };

  return (
    <GeoJSON
      ref={geoJsonRef}
      data={statesData}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
}


// Helper function to convert state name to file name
function getStateFileName(stateName) {
  const stateMapping = {
    Maharashtra: "maharashtra_districts.json",
    "Andhra Pradesh": "andhra_pradesh_districts.json",
    "Arunachal Pradesh": "arunanchal_pradesh_districts.json",
    Assam: "assam_districts.json",
    Bihar: "bihar_districts.json",
    Chandigarh: "chandigarh_districts.json",
    Chhattisgarh: "chhattisgarh_districts.json",
    Goa: "goa_districts.json",
    Gujarat: "gujarat_districts.json",
    Haryana: "haryana_districts.json",
    "Himachal Pradesh": "himachal_pradesh_districts.json",
    "Jammu and Kashmir": "jammu_&_kashmir_districts.json",
    Jharkhand: "jharkhand_districts.json",
    Karnataka: "karnataka_districts.json",
    Kerala: "kerala_districts.json",
    "Madhya Pradesh": "madhya_pradesh_districts.json",
    Manipur: "manipur_districts.json",
    Meghalaya: "meghalaya_districts.json",
    Mizoram: "mizoram_districts.json",
    Nagaland: "nagaland_districts.json",
    "NCT of Delhi": "nct_of_delhi_districts.json",
    Odisha: "odisha_districts.json",
    Punjab: "punjab_districts.json",
    Rajasthan: "rajasthan_districts.json",
    Sikkim: "sikkim_districts.json",
    "Tamil Nadu": "tamil_nadu_districts.json",
    Tripura: "tripura_districts.json",
    "Uttar Pradesh": "uttar_pradesh_districts.json",
    Uttarakhand: "uttarakhand_districts.json",
    "West Bengal": "west_bengal_districts.json",
    "Andaman and Nicobar Islands": "andaman_&_nicobar_island_districts.json",
    "Dadra and Nagar Haveli": "dadara_&_nagar_havelli_districts.json",
    "Daman and Diu": "daman_&_diu_districts.json",
    Lakshadweep: "lakshadweep_districts.json",
    Puducherry: "puducherry_districts.json",
  };

  return stateMapping[stateName] || null;
}

// Districts layer component
function DistrictsLayer({ selectedState, selectedDistrict, submitCount }) {
  const map = useMap();
  const geoJsonRef = useRef();
  const [districtsData, setDistrictsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDistrictsData = async () => {
      if (!selectedState) return;

      setLoading(true);
      try {
        const fileName = getStateFileName(selectedState);
        if (!fileName) {
          console.error("No districts file found for state:", selectedState);
          setDistrictsData(null);
          setLoading(false);
          return;
        }

        // Fixed fetch path (was missing backticks / quotes)
        const response = await fetch(`/map_data/${fileName}`);
        if (!response.ok) {
          throw new Error(`Failed to load ${fileName}: ${response.status}`);
        }
        const data = await response.json();
        setDistrictsData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading districts data:", error);
        setDistrictsData(null);
        setLoading(false);
      }
    };

    loadDistrictsData();
  }, [selectedState]);

  const districtStyle = () => {
    return {
      fillColor: "#4A7FA7", // themed fill color for districts
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.6,
    };
  };

  const onEachDistrict = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: 3,
          color: "#4A7FA7",
          dashArray: "",
          fillOpacity: 0.8,
        });
        e.target.bringToFront();
      },
      mouseout: (e) => {
        if (geoJsonRef.current) geoJsonRef.current.resetStyle(e.target);
      },
      click: (e) => {
        map.fitBounds(e.target.getBounds());
      },
    });

    try {
      const district = feature.properties && feature.properties.DISTRICT;
      const st = feature.properties && feature.properties.ST_NM;
      layer.bindPopup(
        `<b>${district || "Unknown District"}</b><br/>State: ${st || "Unknown"}`
      );
    } catch {
      layer.bindPopup("District info");
    }
  };

  // When a district is provided (and submit triggered), zoom and highlight it
  useEffect(() => {
    if (!geoJsonRef.current || !selectedDistrict || !districtsData) return;
    let layers = [];
    try {
      // react-leaflet GeoJSON ref exposes getLayers on the underlying layer group
      layers = geoJsonRef.current.getLayers
        ? geoJsonRef.current.getLayers()
        : [];
    } catch {
      layers = [];
    }

    const normalize = (s) =>
      String(s || "")
        .trim()
        .toLowerCase();
    const targetLayer = layers.find((lyr) => {
      try {
        const props = lyr.feature && lyr.feature.properties;
        return (
          normalize(props && props.DISTRICT) === normalize(selectedDistrict)
        );
      } catch {
        return false;
      }
    });
    if (targetLayer) {
      const bounds = targetLayer.getBounds && targetLayer.getBounds();
      if (bounds) {
        map.fitBounds(bounds);
      }
      try {
        targetLayer.setStyle({
          weight: 4,
          color: "#B3CFE5",
          dashArray: "",
          fillOpacity: 0.9,
        });
      } catch {
        // ignore
      }
      setTimeout(() => {
        try {
          if (geoJsonRef.current) geoJsonRef.current.resetStyle(targetLayer);
        } catch {
          // Ignore reset style errors
        }
      }, 1500);
      try {
        targetLayer.openPopup && targetLayer.openPopup();
      } catch {
        // Ignore popup errors
      }
    }
  }, [submitCount, selectedDistrict, districtsData, map]);

  if (loading) {
    return null; // or a loading component
  }

  if (!districtsData) {
    return null;
  }

  return (
    <GeoJSON
      ref={geoJsonRef}
      data={districtsData}
      style={districtStyle}
      onEachFeature={onEachDistrict}
    />
  );
}

// Legend component
function Legend() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [1, 2, 3, 4, 5, 6, 7, 8];

      for (let i = 0; i < grades.length; i++) {
        // use safe string concatenation
        div.innerHTML +=
          '<i style="background:' +
          getColor(grades[i] + 1) +
          '"></i> ' +
          grades[i] +
          (grades[i + 1] ? " &ndash; " + grades[i + 1] + "<br>" : "+");
      }

      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}

// Back button component
function BackButton({ onBack }) {
  const map = useMap();

  useEffect(() => {
    const backButton = L.control({ position: "topleft" });

    backButton.onAdd = () => {
      const div = L.DomUtil.create("div", "back-button");
      div.innerHTML = `
        <button 
          style="
            background: #1A3D63; 
            color: #F6FAFD; 
            border: none; 
            padding: 8px 12px; 
            border-radius: 4px; 
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          "
          onmouseover="this.style.background='#0A1931'"
          onmouseout="this.style.background='#1A3D63'"
        >
          ← Back to States
        </button>
      `;

      // clicking anywhere on the DIV triggers the callback
      div.onclick = onBack;
      return div;
    };

    backButton.addTo(map);

    return () => {
      backButton.remove();
    };
  }, [map, onBack]);

  return null;
}

// Main map component
function SubmitController({
  externalSelectedState,
  submitCount,
  onShowDistricts,
}) {
  const map = useMap();

  useEffect(() => {
    if (!submitCount) return;
    if (!externalSelectedState) return;

    try {
      // Find selected state feature in statesData and fit to it like on click
      const targetName = String(externalSelectedState).trim().toLowerCase();
      const feature = statesData.features.find(
        (f) => String(f.properties.ST_NM).trim().toLowerCase() === targetName
      );
      if (feature) {
        const layer = L.geoJSON(feature);
        const bounds = layer.getBounds();
        if (bounds && bounds.isValid()) {
          map.fitBounds(bounds);
        }
      }
    } catch {
      // Ignore bounds errors
    }

    // Switch to districts view
    onShowDistricts(externalSelectedState);
  }, [submitCount, externalSelectedState, map, onShowDistricts]);

  return null;
}

function SitesMarkers({ onSiteSelect, selectedState, allSites, sitesLoading }) {
  const map = useMap();

  // Use dynamic sites data from API instead of static data
  const sites = allSites || [];

  // Filter sites by selected state
  const filteredSites = selectedState
    ? sites.filter((site) => site.State === selectedState)
    : sites;

  // Debug logging
  // Keep console.debug to avoid noisy logs in production
  console.debug("SitesMarkers render:", {
    sitesLoading,
    allSitesCount: sites.length,
    selectedState,
    filteredSitesCount: filteredSites.length,
  });

  // Show loading indicator if sites are being fetched
  if (sitesLoading) {
    return null; // You could add a loading marker here if needed
  }

  return (
    <>
      {filteredSites.map((site) => {
        const lat = site?.location?.lat;
        const lon = site?.location?.lon;
        if (typeof lat !== "number" || typeof lon !== "number") return null;

        // Get HPI and HEI values for marker styling
        const hpi = site?.latestTest?.HPI;
        const hei = site?.latestTest?.HEI;

        // Determine marker color based on pollution levels
        const getMarkerColor = () => {
          if (
            (typeof hpi === "number" && hpi > 100) ||
            (typeof hei === "number" && hei > 5)
          )
            return "#A64C67"; // high level
          if (
            (typeof hpi === "number" && hpi > 50) ||
            (typeof hei === "number" && hei > 3)
          )
            return "#EB5E60"; // medium level
          return "#FEE49F"; // low level
        };

        // Create custom icon
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background-color: ${getMarkerColor()};
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid #F6FAFD;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        return (
          <Marker
            key={site._id || `${lat}-${lon}`}
            position={[lat, lon]}
            icon={customIcon}
            eventHandlers={{
              click: () => {
                onSiteSelect && onSiteSelect(site);
              },
            }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <div style={{ fontWeight: 600 }}>
                  {(site.siteArea || site.siteCode) +
                    (site.siteCode ? ` (Site No:-${site.siteCode})` : "")}
                </div>
                <div style={{ fontSize: 12, color: "var(--foreground)" }}>
                  {site.State}
                </div>
                <div style={{ fontSize: 12 }}>
                  Lat: {lat}, Lon: {lon}
                </div>
                {typeof hpi === "number" && (
                  <div style={{ fontSize: 12, color: "var(--foreground)" }}>
                    HPI: {hpi.toFixed(2)}
                  </div>
                )}
                {typeof hei === "number" && (
                  <div style={{ fontSize: 12, color: "var(--foreground)" }}>
                    HEI: {hei.toFixed(2)}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default function ChoroplethMap({
  selectedState: externalSelectedState,
  selectedDistrict,
  submitCount,
  allSites,
  sitesLoading,
  onSiteSelect,
  onBackToStates,
}) {
  const [showDistricts, setShowDistricts] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

  // Debug logging
  console.debug("ChoroplethMap props:", {
    externalSelectedState,
    selectedDistrict,
    submitCount,
    allSitesCount: allSites?.length || 0,
    sitesLoading,
    showDistricts,
  });

  const handleStateClick = (stateName) => {
    setSelectedState(stateName);
    setShowDistricts(true);
  };

  const handleBackToStates = () => {
    setShowDistricts(false);
    setSelectedState(null);
    // Call parent callback to reset state selection
    if (onBackToStates) {
      onBackToStates();
    }
  };

  // Respond to external submit for any state
  useEffect(() => {
    if (!submitCount) return;
    if (externalSelectedState) {
      setSelectedState(externalSelectedState);
      setShowDistricts(true);
    }
  }, [submitCount, externalSelectedState]);

  return (
    <div className="relative w-full h-[600px]">
      
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={4}
        scrollWheelZoom={true}
        style={{ height: "600px", width: "100%" }}
        className="rounded-sm border"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {(showDistricts ||
          (externalSelectedState && (allSites || []).length > 0)) && (
          <SitesMarkers
            onSiteSelect={onSiteSelect}
            selectedState={selectedState}
            allSites={allSites}
            sitesLoading={sitesLoading}
          />
        )}
        <SubmitController
          externalSelectedState={externalSelectedState}
          selectedDistrict={selectedDistrict}
          submitCount={submitCount}
          onShowDistricts={(stateName) => {
            setSelectedState(stateName);
            setShowDistricts(true);
          }}
        />
        {!showDistricts && statesData && (
          <ChoroplethLayer
            showDistricts={showDistricts}
            onStateClick={handleStateClick}
          />
        )}
        {showDistricts && (
          <DistrictsLayer
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            submitCount={submitCount}
          />
        )}
        {showDistricts && <BackButton onBack={handleBackToStates} />}
        <Legend />
      </MapContainer>
    </div>
  );
}
