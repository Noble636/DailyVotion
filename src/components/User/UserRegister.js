import React, { useState } from "react";
import TopBar from "../TopBar";
import "../../css/User/UserRegister.css";

function UserRegister() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // agreement / modal state
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // show agreement modal before completing signup
    setShowAgreementModal(true);
  };

  const handleCompleteSignup = async () => {
    // simple client-side check: passwords match
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
      // Check if username or email is taken before submitting
      try {
        const checkRes = await fetch(`https://dailyvotionbackend-91wt.onrender.com/api/admin/users`);
        const users = await checkRes.json();
        const usernameTaken = users.some(u => u.username === form.username);
        const emailTaken = users.some(u => u.email === form.email);
        if (usernameTaken) {
          alert("Username is already taken. Please choose another.");
          return;
        }
        if (emailTaken) {
          alert("Email is already registered. Please use another.");
          return;
        }
      } catch (err) {
        // If check fails, allow backend to handle duplicate error
      }
    try {
      const res = await fetch("https://dailyvotionbackend-91wt.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          mobile: form.mobile,
          password: form.password
        })
      });
      const data = await res.json();
      if (res.ok) {
        // Save userId to localStorage if returned
        if (data.id) {
          localStorage.setItem('userId', data.id);
        }
        setShowAgreementModal(false);
        setShowSuccessModal(true);
        // clear form
        setForm({
          fullName: "",
          username: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: ""
        });
        setAgreed(false);
        // Show success popup for 2 seconds, then redirect
        setTimeout(() => {
          setShowSuccessModal(false);
          window.location.href = "/login";
        }, 2000);
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="userregister-outer">
      <TopBar
        logo="DailyVotion"
        menuItems={[
          { label: "Home", link: "/" },
          { label: "Login", link: "/login" },
          { label: "Admin", link: "/adminauth" },
          { label: "About", link: "/about" }
        ]}
      />
      <div className="userregister-main">
        <div className="userregister-form-glass">
          <div className="userregister-form-content">
            <h2 className="userregister-title">Create your Account</h2>
            <form className="userregister-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="userregister-input"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="userregister-input"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="userregister-input"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number (optional)"
                className="userregister-input"
                value={form.mobile}
                onChange={handleChange}
              />
              {/* Password field */}
              <div className="userregister-password-row">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="userregister-input"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="userregister-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  title="Show/Hide Password"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M2 2l16 16" stroke="#888" strokeWidth="2"/>
                      <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6 2.1 0 4.06-.61 5.62-1.62" stroke="#888" strokeWidth="2" fill="none"/>
                      <circle cx="10" cy="10" r="4" stroke="#888" strokeWidth="2" fill="none"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6s8.27-4.11 9-6c-.73-1.89-4-6-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#888"/>
                    </svg>
                  )}
                </span>
              </div>

              {/* Confirm Password field */}
              <div className="userregister-password-row">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="userregister-input"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="userregister-eye"
                  onClick={() => setShowConfirm(!showConfirm)}
                  title="Show/Hide Password"
                >
                  {showConfirm ? (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M2 2l16 16" stroke="#888" strokeWidth="2"/>
                      <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6 2.1 0 4.06-.61 5.62-1.62" stroke="#888" strokeWidth="2" fill="none"/>
                      <circle cx="10" cy="10" r="4" stroke="#888" strokeWidth="2" fill="none"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M10 4C5 4 1.73 8.11 1 10c.73 1.89 4 6 9 6s8.27-4.11 9-6c-.73-1.89-4-6-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#888"/>
                    </svg>
                  )}
                </span>
              </div>
              <button type="submit" className="userregister-signup-btn">SIGN UP</button>
              <div className="userregister-login-link">
                Already have an Account?
                <a href="/login">
                  <button type="button" className="userregister-login-btn">LOGIN</button>
                </a>
              </div>
            </form>
          </div>
        </div>
        <div className="userregister-images">
          <div className="userregister-img-holder userregister-img-holder-top">
            <img src={process.env.PUBLIC_URL + "/JTVCF/gallery/about us/11.jpg"} alt="Group" className="userregister-img" />
            <div className="userregister-img-text userregister-img-text-top">Join the journey.</div>
          </div>
          <div className="userregister-img-holder userregister-img-holder-middle">
            <img src={process.env.PUBLIC_URL + "/JTVCF/gallery/about us/5.jpg"} alt="Ministry" className="userregister-img" />
          </div>
          <div className="userregister-img-holder userregister-img-holder-bottom">
            <img src={process.env.PUBLIC_URL + "/JTVCF/gallery/about us/10.jpg"} alt="Worship" className="userregister-img" />
            <div className="userregister-img-text userregister-img-text-bottom">Be part of <b>JTVCF</b></div>
          </div>
        </div>
      </div>

      {/* Agreement Modal */}
      {showAgreementModal && (
        <div className="agreement-overlay">
          <div className="agreement-modal">
            <h3>Terms & Agreement</h3>
              <p>
                Before creating an account, you must agree to the following:
              </p>
              <ul>
                <li>Your account and personal information will be securely stored on our servers.</li>
                <li>Protect your password and never share it with anyone, including other users or administrators.</li>
                <li>Respect the privacy of others and do not post personal contact details or sensitive information in public areas, such as prayer requests.</li>
                <li>Use this platform responsibly and refrain from any abusive, offensive, or inappropriate behavior.</li>
                <li>By registering, you agree to our Terms of Service and Privacy Policy.</li>
              </ul>

            <label className="agreement-row">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              I have read and agree to the terms above.
            </label>

            <div className="agreement-actions">
              <button className="userregister-btn-secondary" onClick={() => setShowAgreementModal(false)}>Cancel</button>
              <button
                className="userregister-signup-btn"
                onClick={handleCompleteSignup}
                disabled={!agreed}
                title={!agreed ? "You must agree before completing sign up" : "Complete sign up"}
              >
                Complete Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessModal && (
        <div className="agreement-overlay">
          <div className="agreement-modal" style={{textAlign: 'center', padding: '2rem 1.4rem'}}>
            <h3 style={{marginBottom: '0.5rem'}}>Sign up successful</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserRegister;
