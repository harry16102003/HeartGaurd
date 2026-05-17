import "./diet-page.css";

const plans = [
  {
    title: "Indian Heart-Healthy Day",
    items: [
      ["Vegetable poha with peanuts", "Breakfast", "300 kcal"],
      ["Roasted chana", "Snack", "140 kcal"],
      ["2 chapati, dal & mixed sabzi", "Lunch", "430 kcal"],
      ["Guava or pear", "Snack", "120 kcal"],
      ["Palak dal with 2 chapati", "Dinner", "410 kcal"]
    ],
    total: "1400 kcal"
  },
  {
    title: "Balanced Indian Plan",
    items: [
      ["Idli with sambar", "Breakfast", "280 kcal"],
      ["Sprouts chaat (low salt)", "Snack", "170 kcal"],
      ["Rajma with brown rice", "Lunch", "470 kcal"],
      ["Handful of almonds", "Snack", "160 kcal"],
      ["Lauki chana dal with 2 chapati", "Dinner", "390 kcal"]
    ],
    total: "1470 kcal"
  }
];

export default function DietPage() {
  return (
    <div className="hg-diet-shell">
      <aside className="hg-diet-sidebar">
        <div>
          <div className="hg-diet-brand-row">
            <a className="hg-diet-brand" href="/index.html">
              <span className="hg-diet-heart">♥</span>
              <span>HeartGuard</span>
            </a>
            <button className="hg-diet-close" type="button">&times;</button>
          </div>

          <nav className="hg-diet-nav">
            {["Home", "Dashboard", "Predict", "AI Assistant", "Mood Tracker", "Diet Plan", "Monitoring", "Quiz", "Community", "Breathing", "Medications", "About"].map((item) => (
              <a
                key={item}
                className={`hg-diet-nav-item${item === "Diet Plan" ? " active" : ""}`}
                href={item === "Home" ? "/index.html" : item === "Dashboard" ? "/dashboard.html" : item === "Predict" ? "/predict.html" : item === "AI Assistant" ? "/chatbot.html" : item === "Mood Tracker" ? "/mood.html" : "#"}
              >
                <span className="hg-diet-nav-dot" />
                <span>{item}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="hg-diet-sidebar-bottom">
          <a className="hg-diet-sos" href="#">Emergency SOS</a>
          <a className="hg-diet-logout" href="/index.html">Logout</a>
        </div>
      </aside>

      <main className="hg-diet-main">
        <header className="hg-diet-header">
          <h1>Diet &amp; Nutrition</h1>
          <p>Track your meals and follow heart-healthy diet plans</p>
        </header>

        <section className="hg-diet-stats">
          <article className="hg-diet-stat-card">
            <div className="hg-diet-stat-icon amber">🔥</div>
            <div className="hg-diet-stat-value">Dynamic</div>
            <div className="hg-diet-stat-label">Calories Today</div>
          </article>
          <article className="hg-diet-stat-card">
            <div className="hg-diet-stat-icon blue">💧</div>
            <div className="hg-diet-stat-value">Dynamic</div>
            <div className="hg-diet-stat-label">Glasses of Water</div>
          </article>
          <article className="hg-diet-stat-card">
            <div className="hg-diet-stat-icon green">🥗</div>
            <div className="hg-diet-stat-value">Dynamic</div>
            <div className="hg-diet-stat-label">Meals Logged</div>
          </article>
        </section>

        <section className="hg-diet-log-card">
          <h2>Log a Meal</h2>
          <div className="hg-diet-form-row">
            <input placeholder="Food name" />
            <input placeholder="Calories" />
            <select>
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
            <button type="button">+</button>
          </div>
        </section>

        <section className="hg-diet-plans">
          <h2>Suggested Meal Plans</h2>
          <div className="hg-diet-plan-grid">
            {plans.map((plan) => (
              <article className="hg-diet-plan-card" key={plan.title}>
                <div className="hg-diet-plan-title">{plan.title}</div>
                <div className="hg-diet-plan-list">
                  {plan.items.map(([name, type, calories]) => (
                    <div className="hg-diet-plan-item" key={name}>
                      <div>
                        <div className="hg-diet-plan-name">{name}</div>
                        <div className="hg-diet-plan-type">{type}</div>
                      </div>
                      <div className="hg-diet-plan-calories">{calories}</div>
                    </div>
                  ))}
                </div>
                <div className="hg-diet-plan-total">Total: {plan.total}</div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
