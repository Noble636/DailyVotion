import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Admin/Adminauth.css";


function AdminAuth() {
  const [authCode, setAuthCode] = useState("");
  const [showAuthCode, setShowAuthCode] = useState(false);
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminCode: authCode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        navigate("/adminlogin");
      } else {
        alert(data.error || "Invalid Admin Authentication Code");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="adminauth-container">
      <div className="adminauth-paper">
        <h2 className="adminauth-title">Admin Code Authentication</h2>
        <p className="adminauth-warning">
          Please, if you are not an admin and do not have an admin code, exit this page.
        </p>
        <p>Enter the Admin Authentication Code to continue</p>
        <form onSubmit={handleAuthSubmit}>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showAuthCode ? "text" : "password"}
              placeholder="Admin Authentication Code"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="adminauth-input"
              style={{ paddingRight: "2.5rem" }}
            />
            <span
              className="adminauth-eye"
              onClick={() => setShowAuthCode(!showAuthCode)}
              title={showAuthCode ? "Hide Code" : "Show Code"}
              role="button"
              tabIndex={0}
              style={{ position: "absolute", right: 12, top: 12, cursor: "pointer" }}
            >
              {showAuthCode ? (
                // Eye-slash SVG
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path d="M2 2l16 16" stroke="#888" strokeWidth="2"/>
                  <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6 2.1 0 4.06-.61 5.62-1.62" stroke="#888" strokeWidth="2" fill="none"/>
                  <circle cx="10" cy="10" r="4" stroke="#888" strokeWidth="2" fill="none"/>
                </svg>
              ) : (
                // Eye SVG
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6s8.27-4.11 9-6c-.73-1.89-4-6-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#888"/>
                </svg>
              )}
            </span>
          </div>
          <button type="submit" className="adminauth-btn">Enter</button>
        </form>
      </div>
    </div>
  );
}

export default AdminAuth;