import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Admin/Adminregister.css";


function AdminRegister() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    adminCode: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successTimeout, setSuccessTimeout] = useState(null);
  const handleRegisterClick = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("You must agree to the terms and agreements before registering.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!form.adminCode.trim()) {
      alert("Admin code is required.");
      return;
    }
    try {
      const response = await fetch("https://dailyvotionbackend-91wt.onrender.com/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
          adminCode: form.adminCode
        })
      });
      const data = await response.json();
      if (response.ok) {
        setShowSuccessPopup(true);
        const timeout = setTimeout(() => {
          setShowSuccessPopup(false);
          navigate("/adminlogin");
        }, 1500);
        setSuccessTimeout(timeout);
      } else {
      }
    } catch (err) {
    }
  };

  React.useEffect(() => {
    return () => {
      if (successTimeout) clearTimeout(successTimeout);
    };
  }, [successTimeout]);

  return (
    <div className="adminregister-container">
      {showSuccessPopup && (
        <div className="adminregister-modal-overlay">
          <div className="adminregister-modal-box">
            <div className="adminregister-modal-content">
              <h3 style={{ color: '#008b8b', marginBottom: '1rem' }}>Admin registered successfully!</h3>
              <p style={{ color: '#222', fontSize: '1rem', marginBottom: 0 }}>You will be redirected to the login page.</p>
            </div>
          </div>
        </div>
      )}
      <div className="adminregister-paper">
        <div className="adminregister-form-col">
          <h2 className="adminregister-title">Create Admin Account</h2>
          <form onSubmit={handleRegisterClick}>
            <input type="text" name="fullName" placeholder="Full Name" className="adminregister-input" value={form.fullName} onChange={handleChange} required />
            <input type="text" name="username" placeholder="Username" className="adminregister-input" value={form.username} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" className="adminregister-input" value={form.email} onChange={handleChange} required />
            <input type="text" name="mobile" placeholder="Mobile Number (optional)" className="adminregister-input" value={form.mobile} onChange={handleChange} />

            <div className="adminregister-password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="adminregister-input"
                value={form.password}
                onChange={handleChange}
                required
              />
                <span
                  className="adminregister-eye"
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

            <div className="adminregister-password-field">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="adminregister-input"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="adminregister-eye"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={0}
                role="button"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  // Eye-off icon (same as UserRegister)
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M2 2l16 16" stroke="#888" strokeWidth="2"/>
                    <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6 2.1 0 4.06-.61 5.62-1.62" stroke="#888" strokeWidth="2" fill="none"/>
                    <circle cx="10" cy="10" r="4" stroke="#888" strokeWidth="2" fill="none"/>
                  </svg>
                ) : (
                  // Eye icon (same as UserRegister)
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6s8.27-4.11 9-6c-.73-1.89-4-6-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#888"/>
                  </svg>
                )}
              </span>
            </div>

            <div className="adminregister-password-field">
              <input
                type={showAdminCode ? "text" : "password"}
                name="adminCode"
                placeholder="Choose your admin code"
                className="adminregister-input"
                value={form.adminCode}
                onChange={handleChange}
                required
              />
              <span
                className="adminregister-eye"
                onClick={() => setShowAdminCode(!showAdminCode)}
                tabIndex={0}
                role="button"
                aria-label={showAdminCode ? "Hide admin code" : "Show admin code"}
              >
                {showAdminCode ? (
                  // Eye-off icon (same as UserRegister)
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M2 2l16 16" stroke="#888" strokeWidth="2"/>
                    <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6 2.1 0 4.06-.61 5.62-1.62" stroke="#888" strokeWidth="2" fill="none"/>
                    <circle cx="10" cy="10" r="4" stroke="#888" strokeWidth="2" fill="none"/>
                  </svg>
                ) : (
                  // Eye icon (same as UserRegister)
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6s8.27-4.11 9-6c-.73-1.89-4-6-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#888"/>
                  </svg>
                )}
              </span>
            </div>

            <div className="adminregister-actions">
              <button type="submit" className="adminregister-btn" disabled={!agreed}>Register</button>
              <button
                type="button"
                className="adminregister-cancel-btn"
                onClick={() => navigate("/adminlogin")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <aside className="adminregister-terms-col">
          <div className="adminregister-terms-box">
            <h3 className="adminregister-terms-title">Terms & Agreements</h3>

            <p style={{ color: "#b12704", fontWeight: "700" }}>
              Warning: Admin accounts have elevated privileges!
            </p>
            <ul>
              <li>Admin accounts can manage users, content, and sensitive data.</li>
              <li>Only trusted members of the organization should have admin access.</li>
              <li>Never share your admin credentials with anyone outside the organization.</li>
              <li>Misuse of admin privileges may result in account suspension or legal action.</li>
              <li>You are responsible for all actions taken using your admin account.</li>
              <li>By registering, you agree to follow all organizational guidelines and policies.</li>
            </ul>
            <p>Please keep contact details and sensitive data secure.</p>
            
            <label className="adminregister-terms-checkbox">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
              />
              I have read and agree to the terms and agreements
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AdminRegister;