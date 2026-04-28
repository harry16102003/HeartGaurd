import "./landing-page.css";

const features = [
  {
    title: "Heart Risk Prediction",
    description: "AI-powered analysis of your cardiovascular health metrics",
    icon: (
      <path d="M12 21.35 10.55 20C5.4 15.24 2 12.09 2 8.25 2 5.12 4.42 3 7.25 3c1.8 0 3.53.91 4.75 2.34C13.22 3.91 14.95 3 16.75 3 19.58 3 22 5.12 22 8.25c0 3.84-3.4 6.99-8.55 11.75L12 21.35Z" />
    )
  },
  {
    title: "24/7 AI Assistant",
    description: "Chat with our AI doctor anytime for guidance",
    icon: (
      <path d="M9 4H15V6H19C20.1 6 21 6.9 21 8V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V8C3 6.9 3.9 6 5 6H9V4ZM5 8V18H19V8H5ZM10 10H14V12H16V16H8V12H10V10ZM11 12V14H13V12H11Z" />
    )
  },
  {
    title: "Real-time Monitoring",
    description: "Track BP, glucose, heart rate with trend analysis",
    icon: <path d="M3 13H8L11 4L14 20L17 10H21" />
  },
  {
    title: "Privacy First",
    description: "Your health data stays secure and confidential",
    icon: <path d="M12 3 19 6V11C19 15.55 16.11 19.74 12 21 7.89 19.74 5 15.55 5 11V6L12 3Z" />
  },
  {
    title: "Progress Tracking",
    description: "Visualize your health journey with interactive charts",
    icon: (
      <>
        <path d="M5 5V19H19" />
        <path d="M9 17V10" />
        <path d="M13 17V7" />
        <path d="M17 17V12" />
      </>
    )
  },
  {
    title: "Community Support",
    description: "Connect anonymously with others on similar journeys",
    icon: (
      <>
        <path d="M16 11C17.66 11 19 9.66 19 8S17.66 5 16 5 13 6.34 13 8 14.34 11 16 11Z" />
        <path d="M8 13C10.21 13 12 11.21 12 9S10.21 5 8 5 4 6.79 4 9 5.79 13 8 13Z" />
        <path d="M8 15C4.69 15 2 17.24 2 20V21H14V20C14 17.24 11.31 15 8 15Z" />
        <path d="M16 13C14.93 13 13.93 13.28 13.07 13.77C14.26 14.79 15 16.28 15 18V21H22V20C22 16.69 19.31 14 16 14" />
      </>
    )
  },
  {
    title: "Smart Diet Plans",
    description: "Personalized nutrition plans for heart health",
    icon: (
      <>
        <path d="M7 3V11" />
        <path d="M11 3V11" />
        <path d="M9 11V21" />
        <path d="M17 3C15.34 3 14 4.34 14 6V10C14 11.66 15.34 13 17 13H18V21" />
      </>
    )
  },
  {
    title: "Stress Relief",
    description: "Guided breathing exercises and mood tracking",
    icon: (
      <>
        <path d="M4 8H14" />
        <path d="M2 12H17" />
        <path d="M5 16H12" />
        <path d="M19 7C20.66 7 22 8.34 22 10C22 13 18 14 18 17" />
      </>
    )
  }
];

export default function LandingPage() {
  return (
    <div className="hg-page">
      <div className="hg-ambient hg-ambient-left" />
      <div className="hg-ambient hg-ambient-right" />

      <header className="hg-header">
        <a className="hg-brand" href="/index.html" aria-label="HeartGuard home">
          <span className="hg-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 21.35 10.55 20C5.4 15.24 2 12.09 2 8.25 2 5.12 4.42 3 7.25 3c1.8 0 3.53.91 4.75 2.34C13.22 3.91 14.95 3 16.75 3 19.58 3 22 5.12 22 8.25c0 3.84-3.4 6.99-8.55 11.75L12 21.35Z" />
            </svg>
          </span>
          <span className="hg-brand-text">HeartGuard</span>
        </a>

        <nav className="hg-nav" aria-label="Primary">
          <a className="hg-nav-link" href="/login.html">Login</a>
          <a className="hg-nav-cta" href="/login.html">Get Started</a>
        </nav>
      </header>

      <main className="hg-main">
        <section className="hg-hero">
          <div className="hg-eyebrow">AI HEALTH PLATFORM</div>

          <h1 className="hg-title">
            Your heart health,
            <span>powered by AI.</span>
          </h1>

          <p className="hg-copy">
            Predict cardiovascular risk, track vital signs, get AI-powered advice,
            and join a supportive community, all in one secure platform.
          </p>

          <div className="hg-actions">
            <a className="hg-button hg-button-primary" href="/login.html">Start Free</a>
            <a className="hg-button hg-button-secondary" href="/login.html">Login</a>
          </div>
        </section>

        <section className="hg-features">
          <div className="hg-grid">
            {features.map((feature) => (
              <article className="hg-card" key={feature.title}>
                <div className="hg-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    {feature.icon}
                  </svg>
                </div>
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
