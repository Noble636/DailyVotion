import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../TopBar";
import "../../css/User/UserProfile.css";
import { getVerseOfTheDay } from "../BibleVerse";

function UserProfile() {
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [user, setUser] = useState({
    fullName: '',
    username: '',
    profilePic: '',
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`https://dailyvotionbackend-91wt.onrender.com/api/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          setUser({
            fullName: data.fullName,
            username: data.username,
            profilePic: data.profilePic || '',
          });
        });
    }
  }, []);

  // Refresh profile info after editing
  useEffect(() => {
    const handleStorage = () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        fetch(`https://dailyvotionbackend-91wt.onrender.com/api/user/${userId}`)
          .then(res => res.json())
          .then(data => {
            setUser({
              fullName: data.fullName,
              username: data.username,
              profilePic: data.profilePic || '',
            });
            setShowInfoPopup(true);
            setTimeout(() => setShowInfoPopup(false), 1200);
          });
      }
    };
    window.addEventListener('profileUpdated', handleStorage);
    return () => window.removeEventListener('profileUpdated', handleStorage);
  }, []);

  const [latestPrayer, setLatestPrayer] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`hhttps://dailyvotionbackend-91wt.onrender.com/api/user/${userId}/prayer`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setLatestPrayer(data[0]);
          } else {
            setLatestPrayer(null);
          }
        });
    }
  }, []);

  const [latestSOAP, setLatestSOAP] = useState(null);
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`https://dailyvotionbackend-91wt.onrender.com/api/user/${userId}/journal/latest`)
        .then(res => res.json())
        .then(data => {
          if (data && data.scripture) {
            setLatestSOAP({
              title: "Today's SOAP",
              scripture: data.scripture,
              observation: data.observation,
              application: data.application,
              prayer: data.prayer,
              date: data.date
            });
          } else {
            setLatestSOAP(null);
          }
        });

      // Fetch latest reflection message from admin
      fetch(`https://dailyvotionbackend-91wt.onrender.com/api/user/${userId}/reflections`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setReflections(data);
          } else {
            setReflections([]);
          }
        });
    }
  }, []);

  const getLatestSOAP = () => {
    if (latestSOAP && latestSOAP.scripture) return latestSOAP;
    return {
      title: "No Journal Entries Yet",
      scripture: "",
      observation: "",
      application: "",
      prayer: "",
      date: ""
    };
  };

  const openModal = (type) => {
    if (type === "verse") {
      const verse = getVerseOfTheDay();
      setModalData({
        title: "Verse of the Day",
        content: `"${verse.text}" – ${verse.ref}`
      });
    } else if (type === "soap") {
      setModalData(getLatestSOAP());
    } else if (type === "prayer") {
      setModalData(latestPrayer);
    } else if (type === "church") {
      setModalData({
        title: "Full Gospel Christian Church - Worship Service",
        content: [
          "WORSHIP SERVICE SUNDAY | 10AM-12NOON",
          "-------------------------------------------------------------------------------------------------------------",
          "PAGE · THE LINK",
          "Address: JTVCF Center 46 Luzon St. Zone 5 Central Signal, Taguig, Philippines",
          "Contact No.: 09320825895",
          "Email: jesusthetruevine_jvtcf1988@yahoo.com"
        ]
      });
    }
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setModalData(null);
  };

  return (
    <div
      className="userprofile-bg"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/JTVCF/gallery/about%20us/13.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100vw",
        overflow: "auto",
      }}
    >
      <TopBar
        menuItems={[
          { label: "Profile", link: "/profile" },
          { label: "About", link: "/about" },
          { label: "Logout", link: "/" }
        ]}
      />

      {showInfoPopup && (
        <div style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#008b8b',
          color: '#fff',
          padding: '1rem 2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,139,139,0.15)',
          zIndex: 9999
        }}>
          Your info is updated!
        </div>
      )}
      <div className="userprofile-main">
        {/* Left Side */}
        <div className="userprofile-left">
          <div className="userprofile-avatar-section">
            <img
              src={user.profilePic
                ? `https://dailyvotionbackend-91wt.onrender.com${user.profilePic}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username || 'Me')}&background=008b8b&color=fff&size=128`}
              alt="User"
              className="userprofile-avatar"
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username || 'Me')}&background=008b8b&color=fff&size=128`; }}
            />
            <h2 className="userprofile-name">{user.fullName || 'Your Name'}</h2>
            <p className="userprofile-username">{user.username ? `@${user.username}` : '@username'}</p>
          </div>

          <div className="userprofile-buttons">
            <button className="userprofile-btn" onClick={() => navigate("/editprofile")}>Edit Profile</button>
            <button className="userprofile-btn" onClick={() => navigate("/journal")}>Journal</button>
            <button className="userprofile-btn" onClick={() => navigate("/userprayerrequest")}>Add Prayer Request</button>
            <button className="userprofile-btn" onClick={() => navigate("/userreflection")}>Reflection</button>
            <button className="userprofile-btn" onClick={() => navigate("/userfeedback")}>App Feedback</button>
          </div>

          <div
            className="userprofile-box userprofile-verse clickable"
            onClick={() => openModal("verse")}
            role="button"
            tabIndex={0}
          >
            <h3>Verse of the Day</h3>
              {(() => {
                const verse = getVerseOfTheDay();
                return <p style={{margin: "0.5rem 0 0 0"}}>{`"${verse.text}" – ${verse.ref}`}</p>;
              })()}
          </div>
        </div>

        {/* Right Side */}
        <div className="userprofile-right">
          <div
            className="userprofile-box clickable"
            onClick={() => openModal("soap")}
            role="button"
            tabIndex={0}
          >
            <h3>Recent Post</h3>
            <div className="userprofile-post" style={{ minHeight: '100px' }}>
              {latestSOAP && latestSOAP.scripture ? (
                <>
                  <p className="userprofile-date">{latestSOAP.date ? new Date(latestSOAP.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
                  <p className="userprofile-content">{latestSOAP.scripture}</p>
                </>
              ) : (
                <p className="userprofile-content">No Journal Entries Yet</p>
              )}
            </div>
          </div>

          <div
            className="userprofile-box clickable"
            onClick={() => openModal("prayer")}
            role="button"
            tabIndex={0}
          >
            <h3>Prayer Requests</h3>
            {latestPrayer ? (
              <div>
                <p><strong>Date:</strong> {latestPrayer.date ? latestPrayer.date.slice(0, 10) : ""}</p>
                <p><strong>Your Prayer:</strong> {latestPrayer.text}</p>
                {latestPrayer.response && (
                  <p><strong>Admin Response:</strong> {latestPrayer.response}</p>
                )}
              </div>
            ) : (
              <p style={{ color: '#888' }}>No Prayer Requests Yet</p>
            )}
          </div>

          <div
            className="userprofile-box clickable"
            onClick={() => navigate("/userreflection")}
            role="button"
            tabIndex={0}
          >
            <h3>Reflection Activities</h3>
            {reflections.length === 0 ? (
              <p style={{ color: '#888' }}>No reflection activity from admin yet.</p>
            ) : (
              <ul style={{ paddingLeft: 0, margin: 0 }}>
                {reflections.map((reflection) => (
                  <li key={reflection.id} style={{ listStyle: 'none', marginBottom: '0.7rem', background: '#e0f7fa', borderRadius: '8px', padding: '0.7rem' }}>
                    <div style={{ fontWeight: 500, color: '#006d6d' }}>{reflection.message}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Sent: {reflection.sent_at ? new Date(reflection.sent_at).toLocaleString() : ''}</div>
                    {reflection.response && (
                      <div style={{ color: '#07484a', fontSize: '0.96rem', marginTop: '0.3rem' }}><strong>Your Response:</strong> {reflection.response}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            className="userprofile-box clickable"
            onClick={() => openModal("church")}
            role="button"
            tabIndex={0}
          >
            <h3>Church Schedule</h3>
            <p>Sunday Worship • 10:00 AM - 12:00 NOON</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="profile-modal-overlay" onClick={closeModal}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="profile-modal-close" onClick={closeModal}>×</button>
            <h3 className="profile-modal-title">{modalData?.title || (modalType === "prayer" ? "Latest Prayer Request" : "")}</h3>

            {modalType === "verse" && (
              <div className="profile-modal-content">
                <p>{modalData?.content}</p>
              </div>
            )}

            {modalType === "soap" && modalData && (
              <div className="profile-modal-content">
                {modalData.scripture ? (
                  <>
                    <p><strong>Scripture:</strong> {modalData.scripture}</p>
                    <p><strong>Observation:</strong> {modalData.observation}</p>
                    <p><strong>Application:</strong> {modalData.application}</p>
                    <p><strong>Prayer:</strong> {modalData.prayer}</p>
                  </>
                ) : (
                  <p>No Journal Entries Yet</p>
                )}
              </div>
            )}

            {modalType === "prayer" && (
              <div className="profile-modal-content">
                {modalData ? (
                  <>
                    <p><strong>Date:</strong> {modalData.date}</p>
                    <p><strong>Your Prayer:</strong> {modalData.text}</p>
                    {modalData.response ? (
                      <p><strong>Admin Response:</strong> {modalData.response}</p>
                    ) : (
                      <p style={{ color: '#888' }}>No admin response yet.</p>
                    )}
                  </>
                ) : (
                  <p style={{ color: '#888' }}>No Prayer Requests Yet</p>
                )}
              </div>
            )}

            {modalType === "church" && modalData && (
              <div className="profile-modal-content preformatted">
                {Array.isArray(modalData.content)
                  ? modalData.content.map((line, i) => <p key={i}>{line}</p>)
                  : <p>{modalData.content}</p>
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;