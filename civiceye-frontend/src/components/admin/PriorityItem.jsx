import {
  AlertTriangle,
  ChevronRight,
  Clock3,
  MapPin,
} from "lucide-react";

import PriorityBadge from "./PriorityBadge";

function PriorityItem({ complaint, onSelect }) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(complaint);
    }
  };

  const isCritical = complaint.priorityLevel === "CRITICAL";

  return (
    <button
      type="button"
      className={`priority-item ${
        isCritical ? "priority-item-critical" : ""
      }`}
      onClick={handleClick}
    >
      <div className="priority-item-main">
        <div className="priority-item-icon">
          {isCritical ? (
            <AlertTriangle size={16} />
          ) : (
            <Clock3 size={16} />
          )}
        </div>

        <div className="priority-item-content">
          <div className="priority-item-title-row">
            <span className="priority-item-id">
              {complaint.id}
            </span>

            <PriorityBadge
              level={complaint.priorityLevel}
              score={complaint.priorityScore}
            />
          </div>

          <h4>{complaint.title}</h4>

          <div className="priority-item-meta">
            <span>
              <MapPin size={12} />
              {complaint.ward}
            </span>

            <span>
              {complaint.reports}{" "}
              {complaint.reports === 1 ? "report" : "reports"}
            </span>
          </div>
        </div>

        <ChevronRight
          className="priority-item-arrow"
          size={17}
        />
      </div>
    </button>
  );
}

export default PriorityItem;