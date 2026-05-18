import { useState } from "react";
import { register } from "../api";

function RegisterPage({ onLogin, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await register(name, email, password);
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
        <p className="auth-subtitle">Create a new account</p>

        {error && <div className="auth-error">{error}</div>}

        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input"
        />
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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input"
        />
        <button onClick={handleSubmit} className="btn btn-primary btn-full" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={onSwitch} className="auth-link">
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
