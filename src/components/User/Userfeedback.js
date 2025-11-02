import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../TopBar";
import "../../css/User/Userfeedback.css";

function Userfeedback() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    if (!feedback.trim() || !userId) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1800);
      return;
    }
    try {
      const res = await fetch(`https://dailyvotionbackend-91wt.onrender.com/api/user/${userId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: feedback })
      });
      const data = await res.json();
      if (res.ok) {
        setShowPopup(true);
        setFeedback("");
        setTimeout(() => {
          setShowPopup(false);
          navigate(-1);
        }, 1800);
      } else {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 1800);
      }
    } catch (err) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1800);
    }
  };

  const handleCancel = () => {
    setFeedback("");
    navigate(-1);
  };
  return (
    <div className="userfeedback-container">
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
          style={{ marginLeft: '0.5rem', marginRight: '0.5rem', width: 'calc(100% - 1rem)' }}
        />
        <div className="userfeedback-btns">
          <button className="userfeedback-btn" onClick={handleSave}>Save</button>
          <button
            className="userfeedback-btn"
            style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', fontWeight: '500', cursor: 'pointer', marginLeft: '1rem' }}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
        {showPopup && (
          <div style={{
            position: 'fixed',
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#e0f7fa',
            color: '#008b8b',
            padding: '1.2rem 2.2rem',
            borderRadius: '14px',
            fontWeight: 600,
            fontSize: '1.15rem',
            boxShadow: '0 4px 16px rgba(8,163,173,0.18)',
            zIndex: 9999,
            textAlign: 'center'
          }}>
            Your feedback has been recorded successfully!
          </div>
        )}
      </div>
    </div>
  );
}

export default Userfeedback;
