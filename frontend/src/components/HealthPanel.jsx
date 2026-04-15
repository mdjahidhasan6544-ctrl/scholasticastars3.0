import SectionCard from "./SectionCard.jsx";
import StatusBadge from "./StatusBadge.jsx";

function formatUptime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "—";
  }

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }

  return `${minutes}m ${Math.floor(seconds % 60)}s`;
}

export default function HealthPanel({ health }) {
  return (
    <SectionCard
      eyebrow="Render readiness"
      title="Backend health"
      description="Use this card to verify the deployed API is reachable before doing any course operations."
    >
      <div className="health-panel">
        <div className="health-panel__status">
          <StatusBadge tone={health?.status === "ok" ? "success" : "warning"}>
            {health?.status === "ok" ? "Healthy" : "Unknown"}
          </StatusBadge>
          <p>{health?.service || "scholastica3.0-api"}</p>
        </div>

        <dl className="data-list">
          <div>
            <dt>Timestamp</dt>
            <dd>{health?.timestamp ? new Date(health.timestamp).toLocaleString() : "—"}</dd>
          </div>
          <div>
            <dt>Uptime</dt>
            <dd>{formatUptime(health?.uptime)}</dd>
          </div>
        </dl>
      </div>
    </SectionCard>
  );
}