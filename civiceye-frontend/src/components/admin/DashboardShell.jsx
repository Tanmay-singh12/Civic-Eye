import {
  AlertTriangle,
  ClipboardList,
  Clock3,
  ShieldCheck,
} from "lucide-react";

const dashboardPlaceholders = [
  {
    title: "Total Complaints",
    value: "—",
    description: "Awaiting live data",
    icon: ClipboardList,
  },
  {
    title: "Pending",
    value: "—",
    description: "Awaiting live data",
    icon: Clock3,
  },
  {
    title: "Critical",
    value: "—",
    description: "Awaiting live data",
    icon: AlertTriangle,
  },
  {
    title: "Resolved",
    value: "—",
    description: "Awaiting live data",
    icon: ShieldCheck,
  },
];

function DashboardShell() {
  return (
    <section className="dashboard-shell">
      <div className="dashboard-heading">
        <div>
          <p className="dashboard-eyebrow">OVERVIEW</p>

          <h2>Civic Command Center</h2>

          <p>
            Monitor, prioritize and manage civic complaints across Nagpur.
          </p>
        </div>

        <div className="dashboard-live-indicator">
          <span />
          Prototype data
        </div>
      </div>

      <div className="dashboard-stat-grid">
        {dashboardPlaceholders.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="dashboard-stat-card" key={stat.title}>
              <div className="dashboard-stat-top">
                <div className="dashboard-stat-icon">
                  <Icon size={19} />
                </div>

                <span className="dashboard-stat-placeholder">
                  MVP
                </span>
              </div>

              <p>{stat.title}</p>

              <strong>{stat.value}</strong>

              <span>{stat.description}</span>
            </article>
          );
        })}
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-map-panel">
          <div className="dashboard-panel-header">
            <div>
              <p>GEOGRAPHIC OVERVIEW</p>
              <h3>Civic Issue Map</h3>
            </div>

            <span className="dashboard-panel-badge">Coming next</span>
          </div>

          <div className="dashboard-map-placeholder">
            <div className="dashboard-map-grid" />

            <div className="dashboard-map-message">
              <div className="dashboard-placeholder-icon">
                <span>⌖</span>
              </div>

              <h4>Interactive civic map</h4>

              <p>
                Complaint locations and priority markers will appear here.
              </p>
            </div>
          </div>
        </section>

        <section className="dashboard-panel dashboard-priority-panel">
          <div className="dashboard-panel-header">
            <div>
              <p>IMMEDIATE ACTION</p>
              <h3>Priority Queue</h3>
            </div>

            <span className="dashboard-panel-badge">Coming next</span>
          </div>

          <div className="dashboard-empty-state">
            <div className="dashboard-placeholder-icon">
              <AlertTriangle size={20} />
            </div>

            <h4>No live complaints yet</h4>

            <p>
              High-priority complaints will appear here automatically.
            </p>
          </div>
        </section>
      </div>

      <section className="dashboard-panel dashboard-complaints-panel">
        <div className="dashboard-panel-header">
          <div>
            <p>ACTIVITY</p>
            <h3>Recent Complaints</h3>
          </div>

          <span className="dashboard-panel-badge">Coming next</span>
        </div>

        <div className="dashboard-table-placeholder">
          <div className="dashboard-table-row dashboard-table-heading">
            <span>Complaint</span>
            <span>Issue</span>
            <span>Ward</span>
            <span>Priority</span>
            <span>Status</span>
          </div>

          <div className="dashboard-table-empty">
            <ClipboardList size={22} />

            <p>
              Complaint records will appear here once the backend is connected.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

export default DashboardShell;