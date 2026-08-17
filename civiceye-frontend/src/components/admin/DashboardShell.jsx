import {
  AlertTriangle,
  ClipboardList,
  Clock3,
  ShieldCheck,
} from "lucide-react";


import { MOCK_COMPLAINTS } from "../../data/mockComplaints";
import ComplaintTable from "./ComplaintTable";
import PriorityQueue from "./PriorityQueue";
import StatCard from "./StatCard";

function DashboardShell() {
  const totalComplaints = MOCK_COMPLAINTS.length;

  const pendingComplaints = MOCK_COMPLAINTS.filter(
    (complaint) => complaint.status === "PENDING",
  ).length;

  const criticalComplaints = MOCK_COMPLAINTS.filter(
    (complaint) => complaint.priorityLevel === "CRITICAL",
  ).length;

  const resolvedComplaints = MOCK_COMPLAINTS.filter(
    (complaint) => complaint.status === "RESOLVED",
  ).length;

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
          Live dashboard
        </div>
      </div>

      {/* =====================================================
          PRIMARY STATISTICS
          ===================================================== */}

      <div className="dashboard-stat-grid">
        <StatCard
          title="Total Complaints"
          value={totalComplaints}
          description="Complaints in system"
          icon={ClipboardList}
          variant="default"
        />

        <StatCard
          title="Pending"
          value={pendingComplaints}
          description="Awaiting action"
          icon={Clock3}
          variant="warning"
        />

        <StatCard
          title="Critical"
          value={criticalComplaints}
          description="Requires urgent attention"
          icon={AlertTriangle}
          variant="critical"
        />

        <StatCard
          title="Resolved"
          value={resolvedComplaints}
          description="Successfully resolved"
          icon={ShieldCheck}
          variant="success"
        />
      </div>

      {/* =====================================================
          DASHBOARD MAIN CONTENT
          ===================================================== */}

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-map-panel">
          <div className="dashboard-panel-header">
            <div>
              <p>GEOGRAPHIC OVERVIEW</p>
              <h3>Civic Issue Map</h3>
            </div>

            <span className="dashboard-panel-badge">
              Coming next
            </span>
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

        <PriorityQueue complaints={MOCK_COMPLAINTS} />
      </div>

      {/* =====================================================
          RECENT COMPLAINTS
          ===================================================== */}

      <ComplaintTable complaints={MOCK_COMPLAINTS} />
    </section>
  );
}

export default DashboardShell;