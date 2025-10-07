/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo_sih.jpg";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function NavMenu({ user, setUser }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
    setShowDropdown(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // Check if user is on landing/home page
  const isLandingPage =
    location.pathname === "/" || location.pathname === "/home";

  return (
    <div
      className={`sticky top-0 z-50 animate-fade-in ${
        isLandingPage ? "bg-black" : ""
      }`}
    >
      <div className="flex justify-between px-6 md:px-4 py-2 w-full">
        {/* Logo Section */}
        <div className="flex items-center transition-transform hover:scale-105">
          <img
            src={logo}
            alt="logo"
            className="h-12 pl-16 w-auto object-contain transition-all duration-300 hover:brightness-110"
          />
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 flex justify-center">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="flex space-x-1">
              {[
                { path: "/home", label: "Home" },
                { path: "/analysis", label: "Analysis" },
                { path: "/predictive-analysis", label: "Predictive Analysis" },
                { path: "/about-us", label: "About Us" },
              ].map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link
                    to={item.path}
                    className="relative px-3 py-3 inline-block"
                    onMouseEnter={() => setHoveredItem(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span
                      className={`${
                        isActive(item.path)
                          ? "text-white"
                          : isLandingPage
                          ? "text-[#F6FAFD]/80"
                          : "text-[#0A1931]/80"
                      } font-medium text-l transition-colors duration-300`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`absolute bottom-2 left-6 right-6 h-0.5 ${
                        isLandingPage ? "bg-white" : "bg-[#1A3D63]"
                      } transition-transform duration-300 origin-left ${
                        hoveredItem === item.path || isActive(item.path)
                          ? "scale-x-100"
                          : "scale-x-0"
                      }`}
                    ></span>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pr-16">
          <div className="transition-transform hover:scale-110 active:scale-95">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-11 h-11 bg-gradient-to-br from-[#1A3D63] to-[#0A1931] border-[#0E2746] hover:from-[#1F4C7C] hover:to-[#0E2746] hover:border-[#1A3D63] text-white transition-all duration-300 hover:shadow-xl relative group"
            >
              <Bell className="w-6 h-6 group-hover:animate-pulse" />
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#B3CFE5] to-[#4A7FA7] rounded-full animate-pulse" />
            </Button>
          </div>

          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-11 h-11 bg-gradient-to-br from-[#1A3D63] to-[#0A1931] border-[#0E2746] hover:from-[#1F4C7C] hover:to-[#0E2746] hover:border-[#1A3D63] text-white transition-all duration-300 hover:shadow-xl"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <User className="w-4 h-4" strokeWidth={2} />
            </Button>

            {/* Enhanced Dropdown */}
            {showDropdown && (
              <div
                className="absolute right-6 top-16 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[220px] animate-dropdown"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                {!user ? (
                  <>
                    <div
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/signup");
                      }}
                      className="px-6 py-3 cursor-pointer transition-all duration-200 border-b font-medium text-[#0A1931] hover:text-[#1A3D63] hover:bg-[var(--muted)] flex items-center space-x-3"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-[#B3CFE5] to-[#4A7FA7] rounded-full"></div>
                      <span>Register</span>
                    </div>
                    <div
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/login");
                      }}
                      className="px-6 py-3 cursor-pointer transition-all duration-200 font-medium text-[#0A1931] hover:text-[#1A3D63] hover:bg-[var(--muted)] flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-[#4A7FA7] to-[#1A3D63] rounded-full"></div>
                      <span>Sign In</span>
                    </div>
                  </>
                ) : (
                  <div
                    onClick={handleLogout}
                    className="px-6 py-3 cursor-pointer transition-all duration-200 font-medium text-[#0A1931] hover:text-[#1A3D63] hover:bg-[var(--muted)] flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-[#B3CFE5] to-[#4A7FA7] rounded-full"></div>
                    <span>Log Out</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
