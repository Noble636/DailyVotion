import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/User/UserLogin.css";
import TopBar from "../TopBar";

function Login() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password.trim()) {
      setWarning("Please enter both email/username and password.");
      return;
    }
    setWarning("");
    try {
      const res = await fetch("https://dailyvotionbackend-91wt.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.id) {
          localStorage.setItem('userId', data.id);
          // Fetch user info (including profilePic) and store in localStorage
          try {
            const userRes = await fetch(`https://dailyvotionbackend-91wt.onrender.com/api/user/${data.id}`);
            if (userRes.ok) {
              const userInfo = await userRes.json();
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
            }
          } catch (err) {
            // Ignore fetch error, fallback to profile fetch on profile page
          }
        }
        // Remember Me logic
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedUser', emailOrUsername);
          localStorage.setItem('rememberedPass', password);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedUser');
          localStorage.removeItem('rememberedPass');
        }
        navigate("/profile");
      } else {
        setWarning(data.error || "Login failed");
      }
    } catch (err) {
      setWarning("Server error. Please try again later.");
    }
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  // Autofill remembered credentials on mount
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberMe') === 'true';
    if (remembered) {
      setRememberMe(true);
      setEmailOrUsername(localStorage.getItem('rememberedUser') || "");
      setPassword(localStorage.getItem('rememberedPass') || "");
    }
  }, []);

  // Remove remembered credentials immediately when unchecked
  React.useEffect(() => {
    if (!rememberMe) {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberedUser');
      localStorage.removeItem('rememberedPass');
    }
  }, [rememberMe]);

  return (
    <div className="userlogin-outer">
      <TopBar
        logo="DailyVotion"
        menuItems={[
          { label: "Home", link: "/" },
          { label: "Login", link: "/login" },
          { label: "Admin", link: "/adminauth" },
          { label: "About", link: "/about" }
        ]}
      />
      <div className="userlogin-main">
        <div className="userlogin-form-glass">
          <div className="userlogin-form-content">
            <h2 className="userlogin-title">Login to DailyVotion</h2>
            {warning && (
              <div className="userlogin-warning">
                {warning}
              </div>
            )}
            <form onSubmit={handleLogin} className="userlogin-form">
              <input
                type="text"
                placeholder="Email Or Username"
                className="userlogin-input"
                value={emailOrUsername}
                onChange={e => setEmailOrUsername(e.target.value)}
                required
              />
              <div className="userlogin-password-row">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="userlogin-input"
                  value={password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="userlogin-eye"
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
              <div className="userlogin-options-row">
                <label className="userlogin-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  Remember Me
                </label>
                <button
                  type="button"
                  className="userlogin-forgot"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                className="userlogin-loginbtn"
              >
                Log In
              </button>
            </form>
            <div className="userlogin-divider"></div>
            <div className="userlogin-register-row">
              <span>New to DailyVotion?</span>
              <button
                className="userlogin-createbtn"
                onClick={() => navigate("/register")}
              >
                Create An Account
              </button>
            </div>
          </div>
        </div>
        <div className="userlogin-images">
          <img src="/JTVCF/for background picture/3.jpg" alt="Image 1" className="userlogin-img userlogin-img-top" />
          <img src="/JTVCF/for background picture/1.jpg" alt="Image 2" className="userlogin-img userlogin-img-middle" />
          <img src="/JTVCF/gallery/ministry or organization/3.jpg" alt="Image 3" className="userlogin-img userlogin-img-bottom" />
        </div>
      </div>
    </div>
  );
}

export default Login;
