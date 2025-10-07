import React from "react";
import { Navigate } from "react-router-dom";

const AuthWrapper = ({ children, user }) => {
  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the protected content
  return children;
};

export default AuthWrapper;

