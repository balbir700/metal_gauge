import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// Helper: get data needed for graph from site object
function parseSiteData(site) {
  if (!site || !site.latestTest) return { hpi: 0, hei: 0, metals: {} };
  const test = site.latestTest;
  const hpi = test.HPI ?? 0;
  const hei = test.HEI ?? 0;
  const metals = {};
  (test.metals || []).forEach(({ metal, Igeo, CF, iGeo }) => {
    // Metal name may vary in case - normalize "iGeo" or "Igeo"
    metals[metal] = { iGeo: iGeo ?? Igeo ?? 0, CF: CF ?? 0 };
  });
  return { hpi, hei, metals };
}

export default function ComparisonGraph({
  leftSite,
  rightSite,
  leftDistrictName,
  rightDistrictName,
}) {
  if (!leftSite || !rightSite) return null;

  const leftData = parseSiteData(leftSite);
  const rightData = parseSiteData(rightSite);

  // Match metal names and include only those that likely exist in your data
  const metalsToCompare = ["Pb", "Cd", "Zn", "Hg"]; // Pb for Lead, Cd for Cadmium, Zn for Zinc, Hg for Mercury
  const categories = [
    "HPI",
    "HEI",
    ...metalsToCompare.map((m) => `iGeo: ${m}`),
    ...metalsToCompare.map((m) => `CF: ${m}`),
  ];

  const data = categories.map((name) => ({
    name,
    [leftDistrictName]:
      name === "HPI"
        ? leftData.hpi
        : name === "HEI"
        ? leftData.hei
        : name.startsWith("iGeo:")
        ? leftData.metals[name.split(": ")[1]]?.iGeo ?? 0
        : name.startsWith("CF:")
        ? leftData.metals[name.split(": ")[1]]?.CF ?? 0
        : 0,
    [rightDistrictName]:
      name === "HPI"
        ? rightData.hpi
        : name === "HEI"
        ? rightData.hei
        : name.startsWith("iGeo:")
        ? rightData.metals[name.split(": ")[1]]?.iGeo ?? 0
        : name.startsWith("CF:")
        ? rightData.metals[name.split(": ")[1]]?.CF ?? 0
        : 0,
  }));

  return (
    <div style={{ width: "100%", height: 380, marginTop: 20 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
          barCategoryGap="40%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          <ReferenceLine x="HEI" stroke="var(--border)" />
          <ReferenceLine x="iGeo: Hg" stroke="var(--border)" />
          <ReferenceLine x="CF: Hg" stroke="var(--border)" />

          <Bar dataKey={leftDistrictName} fill="var(--chart-1)" />
          <Bar dataKey={rightDistrictName} fill="var(--chart-2)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
