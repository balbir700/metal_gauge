import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";

export default function SigninPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields!");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/v1/users/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Store token if present
        if (response.data.data?.accessToken) {
          localStorage.setItem("token", response.data.data.accessToken);
        }
        // Set user data if setUser function is provided
        if (setUser && response.data.data?.user) {
          setUser(response.data.data.user);
        }
        alert("✅ Login successful!");
        navigate("/"); // Go to home page
      } else {
        throw new Error(response.data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        `Login failed: ${
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
    <div
      className="h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #F6FAFD 0%, #B3CFE5 40%, #F6FAFD 100%)",
      }}
    >
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-5">
        {/* Left: Form - 60% */}
        <div
          className="px-6 md:px-10 py-8 md:py-10 flex items-center justify-center md:col-span-3 h-full overflow-hidden"
          style={{
            background: "color-mix(in sRGB, var(--card) 85%, transparent)",
            borderRight: "1px solid var(--border)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1
                className="text-4xl font-extrabold leading-tight"
                style={{ color: "var(--foreground)" }}
              >
                Sign in
              </h1>
              <p
                className="text-2xl font-semibold mt-1 tracking-wide"
                style={{ color: "var(--foreground)" }}
              >
                to
              </p>
              <p
                className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2"
                style={{ color: "var(--foreground)" }}
              >
                METAL GAUGE
              </p>
            </div>

            <p
              className="text-center mb-6"
              style={{ color: "var(--muted-foreground)" }}
            >
              Sign in with your email
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md"
                  style={{
                    background: "#EEF6FB",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                  placeholder="Researcher Email"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md"
                  style={{
                    background: "#EEF6FB",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                  placeholder="Password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "var(--accent)" }}
              >
                {loading ? "Signing In..." : "SIGN IN"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p style={{ color: "var(--muted-foreground)" }}>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium transition-colors"
                  style={{ color: "var(--accent)" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = "var(--secondary)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.color = "var(--accent)")
                  }
                >
                  Sign Up
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
