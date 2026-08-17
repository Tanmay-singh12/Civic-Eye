import { ArrowUpRight, Zap } from "lucide-react";

import PriorityItem from "./PriorityItem";

const MAX_VISIBLE_ITEMS = 5;

function PriorityQueue({ complaints, onSelectComplaint }) {
  const priorityComplaints = [...complaints]
    .filter(
      (complaint) =>
        complaint.status !== "RESOLVED",
    )
    .sort(
      (a, b) =>
        b.priorityScore - a.priorityScore,
    );

  const visibleComplaints = priorityComplaints.slice(
    0,
    MAX_VISIBLE_ITEMS,
  );

  return (
    <section className="dashboard-panel dashboard-priority-panel">
      <div className="dashboard-panel-header">
        <div>
          <p>IMMEDIATE ACTION</p>

          <h3>Priority Queue</h3>
        </div>

        <div className="priority-queue-count">
          <Zap size={12} />

          <span>{priorityComplaints.length}</span>
        </div>
      </div>

      <div className="priority-queue-list">
        {visibleComplaints.length > 0 ? (
          visibleComplaints.map((complaint) => (
            <PriorityItem
              key={complaint.id}
              complaint={complaint}
              onSelect={onSelectComplaint}
            />
          ))
        ) : (
          <div className="priority-queue-empty">
            <div className="dashboard-placeholder-icon">
              <Zap size={19} />
            </div>

            <h4>No active priority complaints</h4>

            <p>
              All current complaints have been resolved.
            </p>
          </div>
        )}
      </div>

      {priorityComplaints.length > MAX_VISIBLE_ITEMS && (
        <button
          type="button"
          className="priority-view-all"
          disabled
        >
          <span>
            Showing top {MAX_VISIBLE_ITEMS} of{" "}
            {priorityComplaints.length}
          </span>

          <span>
            View all
            <ArrowUpRight size={14} />
          </span>
        </button>
      )}
    </section>
  );
}

export default PriorityQueue;