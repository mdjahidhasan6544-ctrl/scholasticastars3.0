export default function AppShell({ children, endpoint }) {
  return (
    <div className="app-shell">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <header className="hero-panel">
        <p className="eyebrow">Scholastica 3.0</p>
        <div className="hero-copy">
          <div>
            <h1>Editorial academic command center for backend-first deployments.</h1>
            <p className="hero-description">
              This dashboard is intentionally wired to a deployed backend only. Use it after the
              Render web service is healthy, then manage live course content with confidence.
            </p>
          </div>

          <div className="hero-details">
            <div className="detail-card">
              <span>Frontend target</span>
              <strong>{endpoint || "Backend URL not configured"}</strong>
            </div>
            <div className="detail-card">
              <span>Deployment discipline</span>
              <strong>Backend → Test → Frontend</strong>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-layout">{children}</main>
    </div>
  );
}