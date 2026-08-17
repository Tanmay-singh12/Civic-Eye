import { ClipboardList, ExternalLink } from "lucide-react";

import ComplaintRow from "./ComplaintRow";

const MAX_VISIBLE_COMPLAINTS = 10;

function ComplaintTable({ complaints, onSelectComplaint }) {
  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt),
    )
    .slice(0, MAX_VISIBLE_COMPLAINTS);

  return (
    <section className="dashboard-panel dashboard-complaints-panel">
      <div className="dashboard-panel-header">
        <div>
          <p>ACTIVITY</p>

          <h3>Recent Complaints</h3>
        </div>

        <div className="complaint-table-header-meta">
          <span>{complaints.length} total</span>

          <button
            type="button"
            className="complaint-view-all"
            disabled
          >
            View all
            <ExternalLink size={12} />
          </button>
        </div>
      </div>

      <div className="complaint-table-wrapper">
        <div className="complaint-table">
          <div className="complaint-table-header">
            <span>ID</span>
            <span>Issue</span>
            <span>Category</span>
            <span>Ward</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Department</span>
            <span />
          </div>

          {recentComplaints.length > 0 ? (
            recentComplaints.map((complaint) => (
              <ComplaintRow
                key={complaint.id}
                complaint={complaint}
                onSelect={onSelectComplaint}
              />
            ))
          ) : (
            <div className="complaint-table-empty">
              <div className="dashboard-placeholder-icon">
                <ClipboardList size={19} />
              </div>

              <h4>No complaints found</h4>

              <p>
                There are currently no complaint records to display.
              </p>
            </div>
          )}
        </div>
      </div>

      {recentComplaints.length > 0 && (
        <div className="complaint-table-footer">
          <span>
            Showing {recentComplaints.length} of{" "}
            {complaints.length} complaints
          </span>

          <span className="complaint-table-footer-note">
            Latest submissions first
          </span>
        </div>
      )}
    </section>
  );
}

export default ComplaintTable;