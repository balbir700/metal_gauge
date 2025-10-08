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
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #F6FAFD 0%, #B3CFE5 40%, #F6FAFD 100%)",
      }}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-[#0A1931] mb-6">
              Metal Gauge
              <span className="text-[#4A7FA7]"> Analytics</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform environmental data into actionable insights with our
              cutting-edge analytics platform for metal pollution assessment and
              policy development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analysis/graphs"
                className="inline-flex items-center px-8 py-4 bg-[#1A3D63] text-white font-semibold rounded-lg hover:bg-[#0A1931] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/predictive-analysis"
                className="inline-flex items-center px-8 py-4 border-2 border-[#4A7FA7] text-[#4A7FA7] font-semibold rounded-lg hover:bg-[#4A7FA7] hover:text-white transition-all duration-300"
              >
                Predictive Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        className="py-20"
        style={{
          background: "color-mix(in sRGB, var(--card) 92%, transparent)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0A1931] mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for comprehensive environmental analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-200"
                style={{
                  background:
                    "color-mix(in sRGB, var(--card) 92%, transparent)",
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-lg mb-4 group-hover:bg-[#1A3D63] transition-colors duration-300"
                  style={{ background: "#EEF6FB" }}
                >
                  <feature.icon
                    className={`h-6 w-6 ${
                      hoveredCard === index ? "text-white" : "text-[#4A7FA7]"
                    }`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#0A1931] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #1A3D63 0%, #0A1931 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-[#B3CFE5] mb-8">
            Join thousands of researchers and policymakers using Metal Gauge
            Analytics
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/analysis/graphs"
              className="inline-flex items-center px-8 py-4 bg-[#4A7FA7] text-white font-semibold rounded-lg hover:bg-[#1A3D63] transition-all duration-300 shadow-lg"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              View Analytics
            </Link>
            <Link
              to="/predictive-analysis"
              className="inline-flex items-center px-8 py-4 border-2 border-[#4A7FA7] text-[#4A7FA7] font-semibold rounded-lg hover:bg-[#4A7FA7] hover:text-white transition-all duration-300"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Predictive Analysis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
