import "./dashboard-page.css";

const sidebarItems = [
  "Home",
  "Dashboard",
  "Predict",
  "AI Assistant",
  "Mood Tracker",
  "Diet Plan",
  "Monitoring",
  "Quiz",
  "Community",
  "Breathing",
  "Medications",
  "About"
];

const stats = [
  { label: "Total Predictions", value: "Dynamic", accent: "teal", icon: "♡" },
  { label: "Average Risk", value: "Dynamic", accent: "amber", icon: "↗" },
  { label: "High Risk Cases", value: "Dynamic", accent: "red", icon: "⚠" },
  { label: "Health Score", value: "Dynamic", accent: "green", icon: "∿" }
];

const achievements = [
  { label: "First Prediction", active: true, emoji: "🏃" },
  { label: "3-Day Streak", active: true, emoji: "🔥" },
  { label: "10 Predictions", active: false, emoji: "💪" },
  { label: "Mood Logger", active: false, emoji: "🧘" },
  { label: "Health Score 80+", active: false, emoji: "☀" }
];

export default function DashboardPage() {
  return (
    <div className="hg-dashboard-shell">
      <aside className="hg-dashboard-sidebar">
        <div>
          <div className="hg-dashboard-brand-row">
            <a className="hg-dashboard-brand" href="/index.html">
              <span className="hg-dashboard-heart">♥</span>
              <span>HeartGuard</span>
            </a>
            <button className="hg-dashboard-close" type="button">×</button>
          </div>

          <nav className="hg-dashboard-nav">
            {sidebarItems.map((item) => (
              <a
                className={`hg-dashboard-nav-item${item === "Dashboard" ? " active" : ""}`}
                href={item === "Predict" ? "/predict.html" : item === "AI Assistant" ? "/chatbot.html" : item === "Home" ? "/index.html" : "#"}
                key={item}
              >
                <span className="hg-dashboard-nav-dot" />
                <span>{item}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="hg-dashboard-sidebar-bottom">
          <a className="hg-dashboard-sos" href="#">Emergency SOS</a>
          <a className="hg-dashboard-logout" href="/index.html">Logout</a>
        </div>
      </aside>

      <main className="hg-dashboard-main">
        <header className="hg-dashboard-header">
          <div>
            <h1>Health Dashboard</h1>
            <p>Your heart health at a glance</p>
          </div>

          <div className="hg-dashboard-streak">
            <span>🔥</span>
            <strong>Dynamic</strong>
            <span>day streak</span>
          </div>
        </header>

        <section className="hg-dashboard-stat-grid">
          {stats.map((stat) => (
            <article className="hg-dashboard-stat-card" key={stat.label}>
              <div className="hg-dashboard-stat-top">
                <span>{stat.label}</span>
                <span className={`hg-dashboard-stat-icon ${stat.accent}`}>{stat.icon}</span>
              </div>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <section className="hg-dashboard-achievements">
          <div className="hg-dashboard-achievements-title">
            <span>⌘</span>
            <h2>Achievements</h2>
          </div>

          <div className="hg-dashboard-achievement-list">
            {achievements.map((achievement) => (
              <div
                className={`hg-dashboard-achievement${achievement.active ? " active" : ""}`}
                key={achievement.label}
              >
                <span>{achievement.emoji}</span>
                <span>{achievement.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="hg-dashboard-chart-grid">
          <article className="hg-dashboard-chart-card">
            <h3>Risk Distribution</h3>
            <div className="hg-dashboard-chart-placeholder">Dynamic Chart</div>
          </article>

          <article className="hg-dashboard-chart-card">
            <h3>Risk by Age</h3>
            <div className="hg-dashboard-chart-placeholder">Dynamic Chart</div>
          </article>

          <article className="hg-dashboard-chart-card">
            <h3>BMI Distribution</h3>
            <div className="hg-dashboard-chart-placeholder">Dynamic Chart</div>
          </article>
        </section>
      </main>
    </div>
  );
}
