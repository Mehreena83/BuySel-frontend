import { Navigate } from "react-router-dom";

function AgentRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "agent") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AgentRoute;