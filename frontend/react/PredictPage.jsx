import "./predict-page.css";

export default function PredictPage() {
  return (
    <div className="hg-predict-shell">
      <aside className="hg-predict-sidebar">
        <div>
          <div className="hg-predict-brand-row">
            <a className="hg-predict-brand" href="/index.html">
              <span className="hg-predict-heart">♥</span>
              <span>HeartGuard</span>
            </a>
            <button className="hg-predict-close" type="button">&times;</button>
          </div>

          <nav className="hg-predict-nav">
            {["Home", "Dashboard", "Predict", "AI Assistant", "Mood Tracker", "Diet Plan", "Monitoring", "Quiz", "Community", "Breathing", "Medications", "About"].map((item) => (
              <a
                key={item}
                className={`hg-predict-nav-item${item === "Predict" ? " active" : ""}`}
                href={item === "Dashboard" ? "/dashboard.html" : item === "Home" ? "/index.html" : item === "AI Assistant" ? "/chatbot.html" : "#"}
              >
                <span className="hg-predict-nav-dot" />
                <span>{item}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="hg-predict-sidebar-bottom">
          <a className="hg-predict-sos" href="#">Emergency SOS</a>
          <a className="hg-predict-logout" href="/index.html">Logout</a>
        </div>
      </aside>

      <main className="hg-predict-main">
        <header className="hg-predict-header">
          <h1>Heart Risk Prediction</h1>
          <p>Enter your health metrics for AI-powered risk analysis</p>
        </header>

        <section className="hg-predict-card">
          <div className="hg-predict-grid">
            {["Age", "BMI", "Cholesterol", "Systolic BP", "Diastolic BP", "Glucose", "Physical Activity (hrs/week)", "Sex", "Smoking", "Hypertension", "Diabetes"].map((label) => (
              <label className="hg-predict-field" key={label}>
                <span>{label}</span>
                <input placeholder={`Enter ${label}`} />
              </label>
            ))}
          </div>

          <div className="hg-predict-advanced">
            <h2>Advanced (Optional)</h2>
            <div className="hg-predict-advanced-grid">
              {["Heart Rate", "Ejection Fraction", "Serum Creatinine"].map((label) => (
                <label className="hg-predict-field" key={label}>
                  <span>{label}</span>
                  <input placeholder={`Enter ${label}`} />
                </label>
              ))}
            </div>
          </div>

          <button className="hg-predict-button" type="button">Predict Risk</button>
        </section>

        <section className="hg-predict-result">
          <div className="hg-predict-result-icon">⚠</div>
          <div className="hg-predict-result-score">71%</div>
          <div className="hg-predict-result-label">High Risk</div>
          <div className="hg-predict-result-confidence">Confidence: 85%</div>
          <div className="hg-predict-result-bar">
            <div className="hg-predict-result-fill" />
          </div>
        </section>
      </main>
    </div>
  );
}
