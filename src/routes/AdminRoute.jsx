import { Navigate, useLocation } from "react-router-dom";

function AdminRoute({ children }) {
  const location = useLocation();

  const adminToken = localStorage.getItem("adminToken");

  let adminUser = null;

  try {
    adminUser = JSON.parse(localStorage.getItem("adminUser"));
  } catch {
    adminUser = null;
  }

  if (!adminToken || !adminUser?.is_master_admin) {
    return (
      <Navigate to="/admin-login" state={{ from: location.pathname }} replace />
    );
  }

  return children;
}

export default AdminRoute;
