import "./diet-page.css";

const plans = [
  {
    title: "Heart-Healthy Day",
    items: [
      ["Oatmeal with berries & walnuts", "Breakfast", "350 kcal"],
      ["Apple with almond butter", "Snack", "200 kcal"],
      ["Grilled salmon with quinoa salad", "Lunch", "500 kcal"],
      ["Mixed nuts & dark chocolate", "Snack", "180 kcal"],
      ["Chicken breast with steamed vegetables", "Dinner", "450 kcal"]
    ],
    total: "1680 kcal"
  },
  {
    title: "Mediterranean Plan",
    items: [
      ["Greek yogurt with honey & granola", "Breakfast", "300 kcal"],
      ["Hummus with veggie sticks", "Snack", "150 kcal"],
      ["Whole-wheat pasta with olive oil & tomatoes", "Lunch", "480 kcal"],
      ["Handful of almonds", "Snack", "160 kcal"],
      ["Grilled fish with roasted vegetables", "Dinner", "420 kcal"]
    ],
    total: "1510 kcal"
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
