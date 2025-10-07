"use client";

import * as React from "react";
import axiosInstance from "@/utils/axiosInstance";
import {
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  AlertTriangle,
  BarChart2,
  TrendingUp,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// -------------------------
// Data will be fetched from API
// -------------------------
const getDefaultData = () => [
  {
    id: "m5gr84i9",
    hpi: 316,
    status: "High",
    site: "Bhandara, Maharashtra",
  },
  {
    id: "3u1reuv4",
    hpi: 242,
    status: "High",
    site: "Nagpur, Maharashtra",
  },
  {
    id: "derv1ws0",
    hpi: 187,
    status: "Medium",
    site: "Raipur, Chhattisgarh",
  },
  {
    id: "5kma53ae",
    hpi: 205,
    status: "High",
    site: "Jabalpur, Madhya Pradesh",
  },
  {
    id: "bhqecj4p",
    hpi: 121,
    status: "Low",
    site: "Bhopal, Madhya Pradesh",
  },
];

// -------------------------
// Chart Data (will be calculated dynamically)
// -------------------------
const calculateChartData = (data) => {
  const statusCounts = data.reduce((acc, row) => {
    const s = row.status;
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  return [
    {
      name: "High",
      value: statusCounts.High || 0,
      fill: "rgba(239,68,68,0.72)",
    }, // red
    {
      name: "Medium",
      value: statusCounts.Medium || 0,
      fill: "rgba(234,179,8,0.72)",
    }, // yellow
    { name: "Low", value: statusCounts.Low || 0, fill: "rgba(34,197,94,0.72)" }, // green
  ];
};

const chartConfig = {
  hpi: { label: "HPI / HEI" },
  High: { label: "High", color: "var(--chart-1)" },
  Medium: { label: "Medium", color: "var(--chart-2)" },
  Low: { label: "Low", color: "var(--chart-3)" },
};

// -------------------------
// Table Columns
// -------------------------
const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      let bgClass = "";
      let textClass = "text-sm font-medium";
      if (status === "High") bgClass = "bg-red-100";
      if (status === "Medium") bgClass = "bg-yellow-100";
      if (status === "Low") bgClass = "bg-green-100";
      return (
        <div
          className={`inline-flex items-center px-2 py-1 rounded ${bgClass}`}
        >
          <span className={textClass}>{String(status)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "site",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Site
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-sm">{row.getValue("site")}</div>,
  },
  {
    accessorKey: "hpi",
    header: () => <div className="text-right">HPI / HEI</div>,
    cell: ({ row }) => {
      const hpi = row.getValue("hpi");
      return <div className="text-right font-medium">{hpi}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const record = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(record.id)}
            >
              Copy record ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View site details</DropdownMenuItem>
            <DropdownMenuItem>View measurement history</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// -------------------------
// CSV Download helper
// -------------------------
function downloadCSV(rows) {
  const headers = ["Site", "HPI/HEI", "Status", "ID"];
  const csvRows = [
    headers,
    ...rows.map((r) => [r.site, r.hpi, r.status, r.id]),
  ];
  const csvString = csvRows
    .map((row) =>
      row
        .map((cell) => {
          const s = String(cell ?? "");
          return `"${s.replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sites_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// -------------------------
// Main Component
// -------------------------
export default function Overview() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

  // New state for API data
  const [overviewData, setOverviewData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [tableData, setTableData] = React.useState(getDefaultData());

  // Function to fetch overview data
  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching overview data...");
      const response = await axiosInstance.get("/api/data/overview");
      console.log("Overview API response:", response.data);
      console.log("Risk Summary data:", response.data.riskSummary);

      // Process API data to match our table structure
      if (
        response.data &&
        response.data.riskSummary &&
        Array.isArray(response.data.riskSummary)
      ) {
        const processedData = [];

        // Define the order we want: High, Medium, Low
        const statusOrder = ["High", "Medium", "Low"];

        // Process each contamination level group in the specified order
        statusOrder.forEach((status) => {
          const levelGroup = response.data.riskSummary.find(
            (group) => group._id === status
          );
          if (levelGroup) {
            const sites = levelGroup.sites || [];

            // Add each site to the table data
            sites.forEach((site, index) => {
              processedData.push({
                id: site.siteCode || `${status}-${index}`,
                hpi: site.latestHPI || 0,
                status: status,
                site: `${site.siteArea}, ${site.State}`,
                siteCode: site.siteCode,
                siteArea: site.siteArea,
                state: site.State,
                location: site.location,
              });
            });
          }
        });

        setTableData(processedData);
        setOverviewData(response.data.riskSummary);
        console.log(
          "Processed table data (ordered High->Medium->Low):",
          processedData
        );
        console.log(
          "Data ordering verification:",
          processedData.map((item) => item.status)
        );
        console.log("Original API data structure:", response.data.riskSummary);
      } else {
        console.error("Invalid API response structure:", {
          hasData: !!response.data,
          hasRiskSummary: !!response.data?.riskSummary,
          riskSummaryType: typeof response.data?.riskSummary,
          riskSummaryIsArray: Array.isArray(response.data?.riskSummary),
        });
        setError(
          "Invalid API response structure - riskSummary not found or not an array"
        );
      }

      console.log("Overview data fetched successfully:", response.data);
      console.log("Full response structure:", {
        hasData: !!response.data,
        hasRiskSummary: !!response.data?.riskSummary,
        riskSummaryLength: response.data?.riskSummary?.length || 0,
        fullResponse: response.data,
      });
    } catch (error) {
      console.error("Error fetching overview data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  React.useEffect(() => {
    fetchOverviewData();
  }, []);

  // Console log current state
  React.useEffect(() => {
    console.log("Overview component state:", {
      loading,
      error,
      overviewData,
      hasData: !!overviewData,
    });
  }, [loading, error, overviewData]);

  // Calculate dynamic chart data
  const chartData = calculateChartData(tableData);

  // Calculate contamination counts from API data structure
  const getContaminationCounts = () => {
    if (overviewData && Array.isArray(overviewData)) {
      const counts = { High: 0, Medium: 0, Low: 0 };
      overviewData.forEach((levelGroup) => {
        if (counts.hasOwnProperty(levelGroup._id)) {
          counts[levelGroup._id] = levelGroup.count || 0;
        }
      });
      return counts;
    }
    // Fallback to table data if API structure not available
    return {
      High: tableData.filter((item) => item.status === "High").length,
      Medium: tableData.filter((item) => item.status === "Medium").length,
      Low: tableData.filter((item) => item.status === "Low").length,
    };
  };

  const contaminationCounts = getContaminationCounts();
  const highContaminationCount = contaminationCounts.High;
  const mediumContaminationCount = contaminationCounts.Medium;
  const lowContaminationCount = contaminationCounts.Low;

  // Console log table data
  console.log("Table data:", tableData);
  console.log("Chart data:", chartData);
  console.log("Contamination counts from API:", contaminationCounts);
  console.log("High contamination count:", highContaminationCount);
  console.log("Medium contamination count:", mediumContaminationCount);
  console.log("Low contamination count:", lowContaminationCount);
  console.log("Pagination settings:", {
    pageSize: pagination.pageSize,
    currentPage: pagination.pageIndex,
    totalRows: tableData.length,
    totalPages: Math.ceil(tableData.length / pagination.pageSize),
  });

  // Log API data structure analysis
  if (overviewData) {
    console.log("API data structure analysis:");
    overviewData.forEach((levelGroup) => {
      console.log(
        `${levelGroup._id}: ${levelGroup.count} sites (${
          levelGroup.sites?.length || 0
        } in array)`
      );
      console.log(`  Sample sites:`, levelGroup.sites?.slice(0, 2) || []);
    });
  }

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="p-6 space-y-8">
      {/* Title + Download */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 700 }}>Overview</div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => downloadCSV(tableData)}>Download CSV</Button>
        </div>
      </div>
      <hr />

      {/* Top 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          style={{
            background: "color-mix(in sRGB, var(--card) 85%, transparent)",
            backdropFilter: "blur(6px)",
          }}
        >
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tableData.length}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              {highContaminationCount} High, {mediumContaminationCount} Medium,{" "}
              {lowContaminationCount} Low
            </p>
          </CardContent>
        </Card>

        <Card
          style={{
            background: "color-mix(in sRGB, var(--card) 85%, transparent)",
            backdropFilter: "blur(6px)",
          }}
        >
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Operational Capability
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,040</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" /> +180.1%
              from last month
            </p>
          </CardContent>
        </Card>

        <Card
          style={{
            background: "color-mix(in sRGB, var(--card) 85%, transparent)",
            backdropFilter: "blur(6px)",
          }}
        >
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95.6%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" /> uptime
              this month
            </p>
          </CardContent>
        </Card>

        <Card
          style={{
            background: "color-mix(in sRGB, var(--card) 85%, transparent)",
            backdropFilter: "blur(6px)",
          }}
        >
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              High Contamination Sites
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highContaminationCount}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              {highContaminationCount > 0
                ? "Sites need attention"
                : "All sites safe"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table + Donut Chart Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Data Table (inside Card) */}
        <Card
          className="w-full"
          style={{
            background: "color-mix(in sRGB, var(--card) 90%, transparent)",
          }}
        >
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
            <CardDescription>Site risk & HPI/HEI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center py-4">
              <Input
                placeholder="Search sites..."
                value={String(table.getColumn("site")?.getFilterValue() ?? "")}
                onChange={(event) =>
                  table.getColumn("site")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="text-muted-foreground flex-1 text-sm">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Donut Chart */}
        <Card
          className="flex flex-col"
          style={{
            background: "color-mix(in sRGB, var(--card) 90%, transparent)",
          }}
        >
          <CardHeader className="items-center pb-0">
            <CardTitle>Risk Contribution Pie Chart</CardTitle>
            <CardDescription>
              Contribution of High, Medium and Low sites
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[340px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              Showing site risk distribution
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
