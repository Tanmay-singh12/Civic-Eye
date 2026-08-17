function PriorityBadge({ level, score, showScore = true }) {
  const normalizedLevel = level?.toUpperCase() || "LOW";

  const levelConfig = {
    CRITICAL: {
      label: "Critical",
      className: "priority-critical",
    },
    HIGH: {
      label: "High",
      className: "priority-high",
    },
    MEDIUM: {
      label: "Medium",
      className: "priority-medium",
    },
    LOW: {
      label: "Low",
      className: "priority-low",
    },
  };

  const config = levelConfig[normalizedLevel] || levelConfig.LOW;

  return (
    <div className={`priority-badge ${config.className}`}>
      <span className="priority-badge-dot" />

      <span>{config.label}</span>

      {showScore && (
        <strong>{score ?? "—"}</strong>
      )}
    </div>
  );
}

export default PriorityBadge;