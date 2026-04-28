import "./chatbot-page.css";

const promptGroups = [
  {
    title: "HEART HEALTH",
    prompts: [
      "What are the early signs of heart disease?",
      "How can I lower my cholesterol naturally?",
      "What exercises are best for heart health?"
    ]
  },
  {
    title: "DIET",
    prompts: [
      "What foods should I avoid for heart health?",
      "Can you suggest a heart-healthy breakfast?",
      "Is intermittent fasting good for the heart?"
    ]
  },
  {
    title: "LIFESTYLE",
    prompts: [
      "How does stress affect heart health?",
      "What's the ideal sleep duration for heart health?",
      "How can I quit smoking effectively?"
    ]
  }
];

export default function ChatbotPage() {
  return (
    <div className="hg-assistant-shell">
      <aside className="hg-assistant-sidebar">
        <div>
          <div className="hg-assistant-brand-row">
            <a className="hg-assistant-brand" href="/index.html">
              <span className="hg-assistant-heart">♥</span>
              <span>HeartGuard</span>
            </a>
            <button className="hg-assistant-close" type="button">&times;</button>
          </div>

          <nav className="hg-assistant-nav">
            {["Home", "Dashboard", "Predict", "AI Assistant", "Mood Tracker", "Diet Plan", "Monitoring", "Quiz", "Community", "Breathing", "Medications", "About"].map((item) => (
              <a
                key={item}
                className={`hg-assistant-nav-item${item === "AI Assistant" ? " active" : ""}`}
                href={item === "Home" ? "/index.html" : item === "Dashboard" ? "/dashboard.html" : item === "Predict" ? "/predict.html" : "#"}
              >
                <span className="hg-assistant-nav-dot" />
                <span>{item}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="hg-assistant-sidebar-bottom">
          <a className="hg-assistant-sos" href="#">Emergency SOS</a>
          <a className="hg-assistant-logout" href="/index.html">Logout</a>
        </div>
      </aside>

      <main className="hg-assistant-main">
        <header className="hg-assistant-header">
          <div>
            <h1>AI Health Assistant</h1>
            <p>Ask anything about heart health, diet, and lifestyle</p>
          </div>
          <button className="hg-assistant-trash" type="button">⌫</button>
        </header>

        <section className="hg-assistant-prompts">
          <div className="hg-assistant-empty">
            <div className="hg-assistant-empty-icon">✦</div>
            <h2>How can I help you today?</h2>
            <p>Choose a prompt or type your question</p>
          </div>

          {promptGroups.map((group) => (
            <section className="hg-assistant-group" key={group.title}>
              <h3>{group.title}</h3>
              {group.prompts.map((prompt) => (
                <button className="hg-assistant-prompt" key={prompt} type="button">
                  {prompt}
                </button>
              ))}
            </section>
          ))}
        </section>

        <form className="hg-assistant-inputbar">
          <input placeholder="Ask about heart health..." />
          <button type="submit">➤</button>
        </form>
      </main>
    </div>
  );
}
