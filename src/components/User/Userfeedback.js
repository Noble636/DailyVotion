import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../TopBar";
import "../../css/User/Userfeedback.css";

function Userfeedback() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    if (!feedback.trim() || !userId) {
      alert("Please enter feedback.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: feedback })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Feedback saved! Thank you.");
        setFeedback("");
        navigate(-1);
      } else {
        alert(data.error || "Failed to save feedback.");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    }
  };

  const handleCancel = () => {
    setFeedback("");
    navigate(-1);
  };

  return (
    <div className="userfeedback-container">
      {/* shared TopBar */}
      <TopBar
        menuItems={[
          { label: "Profile", link: "/profile" },
          { label: "Journal", link: "/journal" },
          { label: "About", link: "/about" },
          { label: "Logout", link: "/" }
        ]}
      />

      <div className="userfeedback-main">
        <div className="userfeedback-title">App Feedback & Report</div>
        <div className="userfeedback-explanation">
          You can share your feedback or report any issues you encounter. Your input helps us improve the app experience for everyone.
        </div>
        <textarea
          className="userfeedback-textarea"
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Type your feedback or report here..."
        />
        <div className="userfeedback-btns">
          <button className="userfeedback-btn" onClick={handleSave}>Save</button>
          <button className="userfeedback-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Userfeedback;
