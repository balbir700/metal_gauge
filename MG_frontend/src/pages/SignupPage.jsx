import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";

export default function SignupPage({ setUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    a_id: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("=== SIGNUP FORM SUBMITTED ===");
    console.log("Form data:", formData);

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      // Generate a_id from email if not provided
      const a_id = formData.a_id || formData.email.split("@")[0];
      console.log("Generated a_id:", a_id);

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("a_id", a_id);

      // Create avatar image
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 100, 100);
      gradient.addColorStop(0, "#4A7FA7");
      gradient.addColorStop(1, "#1A3D63");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 100, 100);

      // Add user initials
      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const initials = formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      ctx.fillText(initials, 50, 50);

      // Convert to blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      formDataToSend.append("avatar", blob, "avatar.png");
      console.log("FormData created, making API call...");

      // Call backend API for signup
      const response = await axiosInstance.post(
        "/api/v1/users/register",
        formDataToSend
      );

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.status === 201) {
        // Store tokens in localStorage
        if (response.data.data.accessToken) {
          localStorage.setItem("token", response.data.data.accessToken);
          console.log("Access token stored:", response.data.data.accessToken);
        }

        // Set user data if setUser function is provided
        if (setUser && response.data.data.user) {
          setUser(response.data.data.user);
          console.log("User data set:", response.data.data.user);
        }

        alert("✅ Signup successful! You are now logged in.");
        navigate("/"); // Navigate to home page instead of login
      } else {
        throw new Error(response.data?.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(
        `Signup failed: ${
          error.response?.data?.message ||
          error.message ||
          "Something went wrong, please try again."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-5">
        {/* Left: Form - 60% */}
        <div className="bg-white px-6 md:px-10 py-8 md:py-10 flex items-center justify-center md:col-span-3 h-full overflow-hidden">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">
                Create Account
              </h1>
              <p className="text-gray-600 mt-2">
                Sign up for Metal Gauge Analytics
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-200/60 placeholder-gray-500 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="a_id"
                  value={formData.a_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-200/60 placeholder-gray-500 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Username (optional)"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-200/60 placeholder-gray-500 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Email"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-200/60 placeholder-gray-500 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Password"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-200/60 placeholder-gray-500 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Confirm Password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-400 text-gray-900 font-bold py-3 rounded-full hover:bg-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "SIGN UP"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium transition-colors"
                  style={{ color: "var(--accent)" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = "var(--secondary)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.color = "var(--accent)")
                  }
                >
                  Log In
                </Link>
              </p>
            </div>

            {/* Optional debug block (hidden to avoid scroll) */}
            <div className="hidden mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
              <strong>Debug Info:</strong>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
          </div>
        </div>

        {/* Right: Image panel - 40% */}
        <div className="hidden md:block md:col-span-2 relative h-full overflow-hidden">
          <img
            src="/images/welcome-back.png"
            alt="Welcome panel"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/step4.jpg";
            }}
          />
        </div>
      </div>
    </div>
  );
}
