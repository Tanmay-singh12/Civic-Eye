import { Bell, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";

function AdminNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const storedUser = localStorage.getItem("civiceye_admin_user");

  let adminUser = {
    name: "CivicEye Admin",
    role: "Administrator",
  };

  if (storedUser) {
    try {
      adminUser = JSON.parse(storedUser);
    } catch {
      // Keep fallback user if localStorage contains invalid data.
    }
  }

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-left">
        <button
          type="button"
          className="admin-mobile-menu"
          aria-label="Open navigation menu"
        >
          <Menu size={21} />
        </button>

        <div>
          <p className="admin-navbar-eyebrow">CIVICEYE</p>
          <h1>Command Center</h1>
        </div>
      </div>

      <div className="admin-navbar-right">
        <button
          type="button"
          className="admin-notification-button"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span className="admin-notification-dot" />
        </button>

        <div className="admin-profile-wrapper">
          <button
            type="button"
            className="admin-profile-button"
            onClick={() => setIsProfileOpen((previous) => !previous)}
            aria-expanded={isProfileOpen}
          >
            <div className="admin-avatar">
              {adminUser.name?.charAt(0).toUpperCase() || "A"}
            </div>

            <div className="admin-profile-info">
              <span>{adminUser.name}</span>
              <small>{adminUser.role}</small>
            </div>

            <ChevronDown size={16} />
          </button>

          {isProfileOpen && (
            <div className="admin-profile-dropdown">
              <p>{adminUser.name}</p>
              <span>{adminUser.role}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;