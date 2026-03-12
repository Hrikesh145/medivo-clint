import { Navigate } from "react-router";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";

const ParticipantRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) return (
    <div style={{
      minHeight: "100vh", background: "#090C16",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Teko, sans-serif", fontSize: "12px",
      letterSpacing: "5px", textTransform: "uppercase",
      color: "rgba(240,244,255,0.2)"
    }}>
      Verifying access...
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (role !== "user") return <Navigate to="/dashboard/add-camp" replace />;

  return children;
};

export default ParticipantRoute;