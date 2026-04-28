import "./login-page.css";

export default function LoginPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = "/dashboard.html";
  };

  return (
    <main className="hg-login-shell">
      <div className="hg-login-ambient hg-login-ambient-left" />
      <div className="hg-login-ambient hg-login-ambient-right" />

      <section className="hg-login-card" aria-labelledby="hg-login-title">
        <a className="hg-login-brand" href="/index.html" aria-label="HeartGuard home">
          <span className="hg-login-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 21.35 10.55 20C5.4 15.24 2 12.09 2 8.25 2 5.12 4.42 3 7.25 3c1.8 0 3.53.91 4.75 2.34C13.22 3.91 14.95 3 16.75 3 19.58 3 22 5.12 22 8.25c0 3.84-3.4 6.99-8.55 11.75L12 21.35Z" />
            </svg>
          </span>
          <span>HeartGuard</span>
        </a>

        <header className="hg-login-copy">
          <h1 id="hg-login-title">Welcome Back</h1>
          <p>Sign in to your health dashboard</p>
        </header>

        <form className="hg-login-form" onSubmit={handleSubmit}>
          <label className="hg-input-shell" htmlFor="hg-email">
            <span className="hg-input-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 6H20V18H4V6Z" />
                <path d="M4 8L12 13L20 8" />
              </svg>
            </span>
            <input id="hg-email" type="email" placeholder="Email" autoComplete="email" required />
          </label>

          <label className="hg-input-shell" htmlFor="hg-password">
            <span className="hg-input-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M7 10V7C7 4.79 8.79 3 11 3H13C15.21 3 17 4.79 17 7V10" />
                <path d="M5 10H19V20H5V10Z" />
              </svg>
            </span>
            <input id="hg-password" type="password" placeholder="Password" autoComplete="current-password" required />
          </label>

          <button className="hg-sign-in-button" type="submit">Sign In</button>
        </form>

        <p className="hg-signup-copy">
          Don't have an account?
          <a href="/dashboard.html">Get Started</a>
        </p>
      </section>
    </main>
  );
}
