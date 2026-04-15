import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { loading, user, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="screen-state">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (!user.isVerifiedStudent || user.status !== "active") {
    return (
      <section className="screen-state">
        <div className="state-panel">
          <p className="eyebrow">Account status</p>
          <h1>Verification pending</h1>
          <p>Your account exists, but learning access stays locked until an admin verifies it.</p>
          <button className="button button-primary" onClick={logout} type="button">
            Log out
          </button>
        </div>
      </section>
    );
  }

  return children || <Outlet />;
}