import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
    enabled: true,
  },
  {
    label: "Complaints",
    icon: ClipboardList,
    path: "/admin/complaints",
    enabled: false,
  },
  {
    label: "Priority Queue",
    icon: Zap,
    path: "/admin/priority",
    enabled: false,
  },
  {
    label: "Civic Map",
    icon: MapPinned,
    path: "/admin/map",
    enabled: false,
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/admin/analytics",
    enabled: false,
  },
];

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("civiceye_admin_auth");
    localStorage.removeItem("civiceye_admin_user");

    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-logo">
          <ShieldCheck size={21} strokeWidth={2.2} />
        </div>

        <div>
          <p className="admin-sidebar-brand">CivicEye</p>
          <p className="admin-sidebar-subtitle">Command Center</p>
        </div>
      </div>

      <div className="admin-sidebar-divider" />

      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        <p className="admin-nav-label">MAIN MENU</p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          if (!item.enabled) {
            return (
              <div
                key={item.label}
                className="admin-nav-item admin-nav-item-disabled"
                title="Available in a later phase"
              >
                <Icon size={18} />
                <span>{item.label}</span>
                <span className="admin-nav-soon">Soon</span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="admin-sidebar-bottom">
        <div className="admin-sidebar-divider" />

        <button
          type="button"
          className="admin-nav-item admin-logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        <div className="admin-sidebar-status">
          <span className="admin-status-dot" />
          <span>System online</span>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;