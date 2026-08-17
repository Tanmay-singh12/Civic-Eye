import { ChevronRight, MapPin } from "lucide-react";

import PriorityBadge from "./PriorityBadge";

const STATUS_LABELS = {
  PENDING: "Pending",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

const STATUS_CLASSES = {
  PENDING: "status-pending",
  ASSIGNED: "status-assigned",
  IN_PROGRESS: "status-in-progress",
  RESOLVED: "status-resolved",
};

function ComplaintRow({ complaint, onSelect }) {
  const statusLabel =
    STATUS_LABELS[complaint.status] || complaint.status;

  const statusClass =
    STATUS_CLASSES[complaint.status] || "status-pending";

  const handleClick = () => {
    if (onSelect) {
      onSelect(complaint);
    }
  };

  return (
    <button
      type="button"
      className="complaint-table-row"
      onClick={handleClick}
    >
      <div className="complaint-cell complaint-id-cell">
        <span>{complaint.id}</span>
      </div>

      <div className="complaint-cell complaint-issue-cell">
        <strong>{complaint.title}</strong>

        <span className="complaint-mobile-location">
          <MapPin size={11} />
          {complaint.area}
        </span>
      </div>

      <div className="complaint-cell complaint-category-cell">
        <span>{complaint.category}</span>
      </div>

      <div className="complaint-cell complaint-ward-cell">
        <span>{complaint.ward}</span>
      </div>

      <div className="complaint-cell complaint-priority-cell">
        <PriorityBadge
          level={complaint.priorityLevel}
          score={complaint.priorityScore}
        />
      </div>

      <div className="complaint-cell complaint-status-cell">
        <span className={`complaint-status ${statusClass}`}>
          <span className="complaint-status-dot" />
          {statusLabel}
        </span>
      </div>

      <div className="complaint-cell complaint-department-cell">
        <span>{complaint.department}</span>
      </div>

      <div className="complaint-row-arrow">
        <ChevronRight size={15} />
      </div>
    </button>
  );
}

export default ComplaintRow;