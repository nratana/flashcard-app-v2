import { useState } from "react";
import { login } from "../api";

function LoginPage({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="auth-title">FlashCard</h1>
        <p className="auth-subtitle">Log in to your account</p>

        {error && <div className="auth-error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input"
        />
        <button onClick={handleSubmit} className="btn btn-primary btn-full" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}
          <span onClick={onSwitch} className="auth-link">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
