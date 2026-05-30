import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import "./Register.css";

import logo from "../assets/lspu_logo.png";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    console.log(data);

    alert("Registered successfully!");

    navigate("/");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src={logo} alt="Logo" className="register-logo" />

        <h1 className="system-title">
          IT Ticketing & Support Management
        </h1>

        <h2>Create Account</h2>

        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <button type="submit">Register</button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;