import React, { useState } from "react";
import AdminTopBar from "./AdminTopBar";
import "../../css/Admin/AdminFPW.css";
import { useNavigate } from "react-router-dom";

function AdminFPW() {
  const [showAuth, setShowAuth] = useState(true); // Start with AdminAuth step
  const [showAdminCode, setShowAdminCode] = useState(false); // For eye toggle
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!adminCode.trim()) {
      setError("Please enter your AdminAuth code.");
      return;
    }
    setError("");
    setShowAuth(false);
    // On success, show email input step
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your admin email address.");
      return;
    }
    setError("");
    setShowOTP(true);
    // Trigger OTP send logic here
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email.");
      return;
    }
    setError("");
    setShowReset(true); // Show password reset section
    setShowOTP(false);
    // Bypass backend for now
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    alert("Password changed! (bypassed, implement backend later)");
    // Optionally redirect or reset state
  };

  return (
    <div className="adminfpw-outer">
      <AdminTopBar />
      <div className="adminfpw-main">
        <div className="adminfpw-form-glass">
          <h2 className="adminfpw-title">Admin Forgot Password</h2>
          {showAuth && (
            <form className="adminfpw-form" onSubmit={handleAuthSubmit}>
              <div className="adminfpw-success">
                Please enter your AdminAuth code to proceed with password reset.
              </div>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showAdminCode ? "text" : "password"}
                  className="adminfpw-input"
                  placeholder="Enter AdminAuth code"
                  value={adminCode}
                  onChange={e => setAdminCode(e.target.value)}
                  required
                  style={{ paddingRight: "2.5rem" }}
                />
                <span
                  className="adminfpw-eye"
                  onClick={() => setShowAdminCode(!showAdminCode)}
                  title="Show/Hide AdminAuth Code"
                  role="button"
                  tabIndex={0}
                  style={{ position: "absolute", right: 12, top: 12, cursor: "pointer" }}
                >
                  {showAdminCode ? (
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
              {error && <div className="adminfpw-error">{error}</div>}
              <button type="submit" className="adminfpw-submitbtn">Verify AdminAuth Code</button>
            </form>
          )}
          {!showAuth && !showOTP && !showReset && (
            <form className="adminfpw-form" onSubmit={handleEmailSubmit}>
              <input
                type="email"
                className="adminfpw-input"
                placeholder="Enter your admin email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {error && <div className="adminfpw-error">{error}</div>}
              <button type="submit" className="adminfpw-submitbtn">Send OTP</button>
            </form>
          )}
          {/* Only show one password reset form after OTP is sent */}
          {!showAuth && showOTP && (
            <form className="adminfpw-form" onSubmit={handleOTPSubmit}>
              <div className="adminfpw-success">
                An OTP has been sent to: <strong>{email}</strong><br />
                Please enter the OTP below to confirm your identity.
              </div>
              <input
                type="text"
                className="adminfpw-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOTP(e.target.value)}
                required
              />
              {error && <div className="adminfpw-error">{error}</div>}
              <button type="submit" className="adminfpw-submitbtn">Verify OTP</button>
            </form>
          )}
          {/* Password reset section after OTP verification */}
          {!showAuth && !showOTP && showReset && (
            <form className="adminfpw-form" onSubmit={handleResetSubmit}>
              <div className="adminfpw-success">
                You may now change your password.
              </div>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="adminfpw-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  style={{ paddingRight: "2.5rem" }}
                />
                <span
                  className="adminfpw-eye"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  title="Show/Hide Password"
                  role="button"
                  tabIndex={0}
                  style={{ position: "absolute", right: 12, top: 12, cursor: "pointer" }}
                >
                  {showNewPassword ? (
                    // Eye-slash SVG (matches UserLogin.js)
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M2 2l16 16" stroke="#888" strokeWidth="2"/>
                      <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6 2.1 0 4.06-.61 5.62-1.62" stroke="#888" strokeWidth="2" fill="none"/>
                      <circle cx="10" cy="10" r="4" stroke="#888" strokeWidth="2" fill="none"/>
                    </svg>
                  ) : (
                    // Eye SVG (matches UserLogin.js)
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6s8.27-4.11 9-6c-.73-1.89-4-6-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#888"/>
                    </svg>
                  )}
                </span>
              </div>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="adminfpw-input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  style={{ paddingRight: "2.5rem" }}
                />
                <span
                  className="adminfpw-eye"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title="Show/Hide Password"
                  role="button"
                  tabIndex={0}
                  style={{ position: "absolute", right: 12, top: 12, cursor: "pointer" }}
                >
                  {showConfirmPassword ? (
                    // Eye-slash SVG (matches login and new password)
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M2 2l16 16" stroke="#888" strokeWidth="2"/>
                      <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6 2.1 0 4.06-.61 5.62-1.62" stroke="#888" strokeWidth="2" fill="none"/>
                      <circle cx="10" cy="10" r="4" stroke="#888" strokeWidth="2" fill="none"/>
                    </svg>
                  ) : (
                    // Eye SVG (matches login and new password)
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6s8.27-4.11 9-6c-.73-1.89-4-6-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#888"/>
                    </svg>
                  )}
                </span>
              </div>
              {error && <div className="adminfpw-error">{error}</div>}
              <button type="submit" className="adminfpw-submitbtn">Change Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminFPW;
