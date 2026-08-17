import { TrendingDown, TrendingUp } from "lucide-react";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
  variant = "default",
}) {
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <article className={`dashboard-stat-card stat-card-${variant}`}>
      <div className="dashboard-stat-top">
        <div className="dashboard-stat-icon">
          <Icon size={19} strokeWidth={2} />
        </div>

        {trend !== undefined && trend !== null && (
          <div
            className={`dashboard-stat-trend ${
              isPositive
                ? "positive"
                : isNegative
                  ? "negative"
                  : "neutral"
            }`}
          >
            {isPositive && <TrendingUp size={12} />}
            {isNegative && <TrendingDown size={12} />}

            <span>
              {isPositive ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>

      <p className="dashboard-stat-title">{title}</p>

      <strong className="dashboard-stat-value">{value}</strong>

      <span className="dashboard-stat-description">
        {trendLabel || description}
      </span>
    </article>
  );
}

export default StatCard;