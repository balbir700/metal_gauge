import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// Components
import NavMenu from "./contents/Navbar";
import AuthWrapper from "./components/AuthWrapper";

// Pages
import HomePage from "./pages/HomePage";
import AnalysisPage from "./pages/AnalysisPage";
import PredictiveAnalysisPage from "./pages/PredictiveAnalysisPage";
import AboutUsPage from "./pages/AboutUsPage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";

function App() {
  // Global user state to track login status
  const [user, setUser] = useState(() => {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div
        className="h-screen flex flex-col"
        style={{
          background:
            "linear-gradient(135deg, #F6FAFD 0%, #B3CFE5 40%, #F6FAFD 100%)",
        }}
      >
        {/* Navbar */}
        <NavMenu user={user} setUser={setUser} />

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            {/* Public routes - no authentication required */}
            <Route path="/signup" element={<SignupPage setUser={setUser} />} />
            <Route path="/login" element={<SigninPage setUser={setUser} />} />
            <Route path="/about-us" element={<AboutUsPage />} />

            {/* Protected routes - authentication required */}
            <Route
              path="/home"
              element={
                <AuthWrapper user={user}>
                  <HomePage />
                </AuthWrapper>
              }
            />
            <Route
              path="/analysis/*"
              element={
                // <AuthWrapper user={user}>
                <AnalysisPage />
                // </AuthWrapper>
              }
            />
            <Route
              path="/predictive-analysis/*"
              element={
                <AuthWrapper user={user}>
                  <PredictiveAnalysisPage />
                </AuthWrapper>
              }
            />
            <Route
              path="/"
              element={
                <AuthWrapper user={user}>
                  <HomePage />
                </AuthWrapper>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
