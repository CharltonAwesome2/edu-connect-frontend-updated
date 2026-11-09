import { useState } from "react";
import { ArrowLeft, CheckCircle2, LockKeyhole, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Brand } from "@components/Brand";
import { useAuth } from "@context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(form.email, form.password, form.remember);
      navigate(location.state?.from || (user.accountType === "ADMIN" ? "/admin" : "/"), { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Check your details and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-side">
        <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to home</Link>
        <div>
          <h1>Welcome back to your learning journey.</h1>
          <p>Pick up where you left off, connect with your tutor, and keep your progress moving.</p>
        </div>
        <div className="auth-benefits">
          <span><CheckCircle2 size={18} /> One place for sessions and progress</span>
          <span><CheckCircle2 size={18} /> Trusted student and tutor profiles</span>
        </div>
      </aside>
      <main className="auth-main">
        <Brand />
        <form className="auth-card" onSubmit={submit}>
          <header><h2>Log in</h2><p>Use your EduConnect account to continue.</p></header>
          {error && <div className="notice notice-error" role="alert">{error}</div>}
          <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
          <label>Password<div className="input-icon"><LockKeyhole size={17} /><input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" /></div></label>
          <label className="check-row"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} /> Remember me</label>
          <button className="button button-primary button-full" type="submit" disabled={busy}>{busy ? "Signing in…" : "Log in"}</button>
          <p className="auth-switch">New to EduConnect? <Link to="/signup">Create an account</Link></p>
        </form>
      </main>
    </div>
  );
}
