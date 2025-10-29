import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import "../../css/Admin/Adminlogin.css";

function AdminLogin() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [warning, setWarning] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    setWarning("");
    try {
      const res = await fetch("https://dailyvotionbackend-91wt.onrender.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername: email, password })
      });
      const data = await res.json();
      if (res.ok && data.type === "admin") {
        sessionStorage.setItem("adminUser", JSON.stringify(data));
        if (data.id) {
          localStorage.setItem("adminId", data.id);
        }
        navigate("/admindashboard");
      } else {
        setWarning(data.error || "Login failed");
      }
    } catch (err) {
      setWarning("Server error. Please try again later.");
    }
  };

  return (
    <div className="adminlogin-container">
      <AdminTopBar />

      <div className="adminlogin-main">
        <div className="adminlogin-paper">
          <h2 className="adminlogin-title">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username or Email"
              className="adminlogin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="adminlogin-password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="adminlogin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="adminlogin-eye"
                onClick={() => setShowPassword(!showPassword)}
                title="Show/Hide Password"
                role="button"
                tabIndex={0}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M2 2l16 16" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6 2.1 0 4.06-.61 5.62-1.62" stroke="#888" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="10" cy="10" r="4" stroke="#888" strokeWidth="2" fill="none"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6s8.27-4.11 9-6c-.73-1.89-4-6-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#888"/>
                  </svg>
                )}
              </span>
            </div>

            {warning && <div className="adminlogin-warning">{warning}</div>}

            <div className="adminlogin-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <button type="button" className="adminlogin-forgot" onClick={() => navigate("/adminfpw")}>Forgot password?</button>
            </div>

            <button type="submit" className="adminlogin-loginbtn">Login</button>
          </form>

          <div className="adminlogin-divider"></div>

          <div className="adminlogin-register">
            <span className="adminlogin-register-title">New administrator account?</span>
            <button className="adminlogin-createbtn" onClick={() => navigate("/adminregister")}>Create Admin Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
