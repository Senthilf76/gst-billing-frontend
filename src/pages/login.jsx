import { useState } from "react";
import "./login.css";
import illustration from "../assets/login-illustration.jpg";

const API_URL = process.env.REACT_APP_API_BASE_URL;

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid credentials");

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        
        {/* LEFT SIDE */}
        <div className="login-left">
          <img src={illustration} alt="login" />
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <h2>Sign up</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <span className="icon">👤</span>
              <input
                type="text"
                placeholder="Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
            </div>

            {error && <p className="error">{error}</p>}

            <button className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="create-account">Create an account</p>

          <div className="social-login">
            <span>Or login with</span>
            <div className="social-icons">
              <button className="fb">f</button>
              <button className="tw">t</button>
              <button className="gg">G</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
