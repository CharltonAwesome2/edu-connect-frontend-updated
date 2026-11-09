import { useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Brand } from "@components/Brand";
import { useAuth } from "@context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", accountType: "STUDENT" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await signup(form);
      navigate(user.accountType === "ADMIN" ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-side">
        <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to home</Link>
        <div><h1>Build a better way to learn together.</h1><p>Join a connected community of students and peer tutors.</p></div>
        <div className="auth-benefits"><span><CheckCircle2 size={18} /> Find support for the subjects you need</span><span><CheckCircle2 size={18} /> Share knowledge and grow your reputation</span></div>
      </aside>
      <main className="auth-main auth-main-wide">
        <Brand />
        <form className="auth-card" onSubmit={submit}>
          <header><h2>Create your account</h2><p>Choose how you want to use EduConnect.</p></header>
          {error && <div className="notice notice-error" role="alert">{error}</div>}
          <label>Full name<input required maxLength={120} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Your full name" /></label>
          <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
          <label>Password<input type="password" required minLength={8} maxLength={72} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /></label>
          <div className="role-picker">
            <button type="button" className={form.accountType === "STUDENT" ? "selected" : ""} onClick={() => setForm({ ...form, accountType: "STUDENT" })}><GraduationCap size={22} /><span>Student<small>Find tutors and track learning</small></span></button>
            <button type="button" className={form.accountType === "TUTOR" ? "selected" : ""} onClick={() => setForm({ ...form, accountType: "TUTOR" })}><BookOpen size={22} /><span>Tutor<small>Help others and build your profile</small></span></button>
          </div>
          <button className="button button-primary button-full" type="submit" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
          <p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p>
        </form>
      </main>
    </div>
  );
}
