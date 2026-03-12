import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#090C16",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        {/* logo */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #0E5060, #1688A0)",
            border: "1px solid rgba(34,170,204,0.35)",
            boxShadow: "0 0 30px rgba(22,136,160,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="7.5" y="1" width="3" height="16" rx="1.5" fill="#5EC8E0" />
            <rect x="1" y="7.5" width="16" height="3" rx="1.5" fill="#5EC8E0" />
          </svg>
        </div>

        {/* spinner ring */}
        <div
          style={{
            position: "relative",
            width: "48px",
            height: "48px",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            style={{ animation: "spin 1.2s linear infinite" }}
          >
            <circle
              cx="24" cy="24" r="20"
              stroke="rgba(240,244,255,0.06)"
              strokeWidth="3"
            />
            <path
              d="M44 24c0-11.046-8.954-20-20-20"
              stroke="#22AACC"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 6px rgba(34,170,204,0.7))" }}
            />
          </svg>
        </div>

        {/* text */}
        <span
          style={{
            fontFamily: "Teko, sans-serif",
            fontSize: "11px",
            letterSpacing: "5px",
            textTransform: "uppercase",
            color: "rgba(240,244,255,0.2)",
          }}
        >
          Authenticating
        </span>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;