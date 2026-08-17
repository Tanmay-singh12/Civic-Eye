import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedAdminRoute() {
  const location = useLocation();

  const isAuthenticated =
    localStorage.getItem("civiceye_admin_auth") === "true";

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;