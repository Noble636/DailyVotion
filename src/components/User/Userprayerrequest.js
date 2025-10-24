
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../TopBar";
import "../../css/User/Userprayerrequest.css";

function Userprayerrequest() {
  const [prayer, setPrayer] = useState("");
  const [requests, setRequests] = useState([]);
  const [showResponseId, setShowResponseId] = useState(null);
  const [sentNotice, setSentNotice] = useState(false);
  const navigate = useNavigate();

  // Fetch user's prayer requests on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:5000/api/user/${userId}/prayer`)
        .then(res => res.json())
        .then(data => setRequests(data));
    }
  }, []);

  const handleSubmit = async () => {
    if (!prayer.trim()) return;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not logged in.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}/prayer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prayer })
      });
      const data = await res.json();
      if (res.ok) {
        setRequests([data.prayer, ...requests]);
        setPrayer("");
        setSentNotice(true);
        setTimeout(() => setSentNotice(false), 3000);
      } else {
        alert(data.error || 'Failed to submit prayer request.');
      }
    } catch (err) {
      alert('Server error. Please try again later.');
    }
  };

  return (
    <div className="userprayerrequest-container">
      <TopBar
        menuItems={[
          { label: "Profile", link: "/profile" },
          { label: "About", link: "/about" },
          { label: "Logout", link: "/" }
        ]}
      />

      <div className="userprayerrequest-main">
        <div className="userprayerrequest-left-stack">
          <div className="userprayerrequest-left">
            <div className="userprayerrequest-title">Add Prayer Request</div>
            <div className="userprayerrequest-explanation">
              Type your prayer request below. It will be reviewed by the admin team.
            </div>

            <textarea
              className="userprayerrequest-textarea"
              value={prayer}
              onChange={e => setPrayer(e.target.value)}
              placeholder="Type your prayer request here..."
            />

            <div className="userprayerrequest-btns">
              <button className="userprayerrequest-btn" onClick={handleSubmit}>Submit</button>
            </div>

            {sentNotice && <div className="sent-notice">Sent to admin — thank you.</div>}
          </div>

          <div className="userprayerrequest-bottom-box-left userprayerrequest-static-note">
            <div className="userprayerrequest-bottom-title">Share with the community</div>
            <p>
              Please use the form on the left to submit a prayer request for the church to pray over.
              Requests are reviewed by the admin and may be included in Sunday prayers or receive an admin reply below.
              Thank you for trusting us to stand with you in prayer.
            </p>
          </div>
        </div>

        <div className="userprayerrequest-right">
          <div className="userprayerrequest-history-title">Prayer Request History</div>

          <div className="userprayerrequest-list">
            {requests.map(req => (
              <div className="userprayerrequest-item" key={req.id}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div className="userprayerrequest-date">{req.date ? req.date.slice(0, 10) : ""}</div>
                  <div className={`request-status ${req.status}`}>{req.status === "pending" ? "Pending" : "Responded"}</div>
                </div>

                <div className="userprayerrequest-history-text">{req.text}</div>

                <button
                  className="userprayerrequest-response-btn"
                  onClick={() => setShowResponseId(showResponseId === req.id ? null : req.id)}
                >
                  {showResponseId === req.id ? "Hide Response" : "View Admin Response"}
                </button>

                {showResponseId === req.id && req.response && (
                  <div className="userprayerrequest-response">{req.response}</div>
                )}
                {showResponseId === req.id && !req.response && (
                  <div className="userprayerrequest-response">No response yet.</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Userprayerrequest;
