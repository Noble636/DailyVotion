import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import "../../css/Admin/AdminDashboard.css";
function AdminDashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="admindash-container"
      style={{ backgroundImage: "url('/JTVCF/for%20background%20picture/AdminDashboard.png')" }}
    >
      <AdminTopBar
        menuItems={[
          { label: "Home", link: "/" },
          { label: "User Login", link: "/login" },
          { label: "About", link: "/about" }
        ]}
      />
      <div className="admindash-main">
        <h1 className="admindash-title">Admin Dashboard</h1>

        <div className="admindash-grid">
          <div className="admindash-card">
            <h2>User Account Management</h2>
            <p>
              Manage user accounts, including registration, roles, and access control.
            </p>
            <button
              className="admindash-btn"
              onClick={() => navigate("/Manageuser")}
            >
              Manage Users
            </button>
          </div>

          <div className="admindash-card">
            <h2>Devotional Content Delivery</h2>
            <p>
              Schedule and deliver daily devotionals, scriptures, and reflections to users.
            </p>
            <button
              className="admindash-btn"
              onClick={() => navigate("/Managecontent")}
            >
              Manage Content
            </button>
          </div>

          <div className="admindash-card">
            <h2>Interactive Prayer</h2>
            <p>
              Oversee prayer requests, inspirational quotes, responses, and interactive features.
            </p>
            <button className="admindash-btn" onClick={() => navigate("/manageprayer")}>Manage Prayers</button>
          </div>

          <div className="admindash-card">
            <h2>Application Feedback</h2>
            <p>
              Users can rate and provide feedback about their experience using the app.
            </p>
            <button className="admindash-btn" onClick={() => navigate("/managefeedback")}>Manage Feedback</button>
          </div>

          <div className="admindash-card" style={{ gridColumn: "1 / span 2", justifySelf: "center" }}>
            <h2>Gallery & Bible Guide</h2>
            <p>
              Upload pictures for gallery albums and Bible Reading Guide.
            </p>
            <button className="admindash-btn" onClick={() => navigate("/adminaddpictures")}>Upload Pictures</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
