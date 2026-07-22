import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user")
    );
  } catch {
    user = null;
  }

  // Agent public route open cheythaal
  if (
    token &&
    user?.role === "agent"
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // Guest and normal user allowed
  return children;
}

export default PublicRoute;