// import { Navigate } from "react-router-dom";

// function AgentRoute({ children }) {
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (user?.role !== "agent") {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }

// export default AgentRoute;



import { Navigate, useLocation } from "react-router-dom";

function AgentRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user")
    );
  } catch {
    user = null;
  }

  // Login cheythittillenkil
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Normal user agent routes open cheythaal
  if (user?.role !== "agent") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default AgentRoute;