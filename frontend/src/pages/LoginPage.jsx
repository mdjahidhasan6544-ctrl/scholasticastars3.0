import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

function buildDeviceFingerprint() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    resolution: `${window.screen.width}x${window.screen.height}`,
    platform: navigator.platform
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="screen-state">Checking session...</div>;
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const nextUser = await login({ ...form, deviceFingerprint: buildDeviceFingerprint() });
      navigate(nextUser.role === "admin" ? "/admin" : location.state?.from || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-screen">
      <div className="auth-hero">
        <p className="eyebrow">Verified learning access</p>
        <h1>Restore the Scholastica LMS experience with student and admin login.</h1>
        <p>Version 3 now starts with the same authenticated routing foundation used by version 1.</p>
      </div>

      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h2>Log in</h2>
        <form className="stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input className="input" name="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </label>
          <label className="field">
            <span>Password</span>
            <input className="input" name="password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button className="button button-primary button-full" disabled={submitting} type="submit">
            {submitting ? "Signing in..." : "Log in"}
          </button>
        </form>
        <p className="muted-copy">New student? <Link to="/register">Create an account</Link></p>
      </div>
    </section>
  );
}