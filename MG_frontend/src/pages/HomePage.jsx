import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Map,
  FileText,
  TrendingUp,
  Shield,
  Brain,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import bgImage from "../assets/bgImage_sih.jpg";

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive data visualization and statistical analysis tools",
    },
    {
      icon: Map,
      title: "Geographic Mapping",
      description: "Interactive maps showing pollution hotspots and trends",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms for predictive analysis",
    },
    {
      icon: Shield,
      title: "Policy Recommendations",
      description:
        "Data-driven policy suggestions for environmental protection",
    },
  ];

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Gradient overlay to maintain readability */}
      <div
        className="absolute inset-0"
        style={{
          background: "color-mix(in sRGB, var(--card)80%, transparent)",
        }}
      />
      {/* Content container with relative positioning */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-[#0A1931] mb-6 leading-tight">
                Metal Gauge
                <span className="text-[#4A7FA7]"> Analytics</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                Transform environmental data into actionable insights with our
                cutting-edge analytics platform for metal pollution assessment
                and policy development.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/analysis/graphs"
                  className="inline-flex items-center px-10 py-4 bg-[#1A3D63] text-white font-semibold rounded-xl hover:bg-[#0A1931] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Start Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/predictive-analysis"
                  className="inline-flex items-center px-10 py-4 border-2 border-[#4A7FA7] text-[#4A7FA7] font-semibold rounded-xl hover:bg-[#4A7FA7] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Predictive Analysis
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-20 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-200/50 hover:border-[#4A7FA7]/50 backdrop-blur-sm"
                  style={{
                    background:
                      "color-mix(in sRGB, var(--card) 70%, transparent)",
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-xl mb-6 group-hover:bg-[#1A3D63] transition-all duration-300 group-hover:scale-110"
                    style={{ background: "rgba(238, 246, 251, 0.6)" }}
                  >
                    <feature.icon
                      className={`h-7 w-7 ${
                        hoveredCard === index ? "text-white" : "text-[#4A7FA7]"
                      } transition-colors duration-300`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A1931] mb-3 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
