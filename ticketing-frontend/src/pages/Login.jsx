import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

// import your logo image
import logo from "../assets/lspu_logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    console.log("LOGIN SUCCESS:", data);

    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">
      <img src={logo} alt="Logo" className="login-logo" />

      <h1 className="system-title">
        IT Ticketing & Support Management
      </h1>

      <h2>Welcome Back</h2>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-text">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}