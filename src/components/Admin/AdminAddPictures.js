import React, { useState } from "react";
import AdminTopBar from "./AdminTopBar";
import "../../css/Admin/AdminAddPictures.css";

function AdminAddPictures() {
  // Bible Reading Guide state
  const [brgMonth, setBrgMonth] = useState("");
  const [brgImage, setBrgImage] = useState(null);
  const [brgImageName, setBrgImageName] = useState("");
  const [brgStatus, setBrgStatus] = useState("");

  // Gallery state
  const [albumName, setAlbumName] = useState("");
  const [createdAlbumId, setCreatedAlbumId] = useState(null);
  const [galleryImage, setGalleryImage] = useState(null);
  const [galleryImageName, setGalleryImageName] = useState("");
  const [galleryStatus, setGalleryStatus] = useState("");

  // Assume adminId is stored in localStorage
  const adminId = localStorage.getItem('adminId');

  // Bible Reading Guide upload handler
  const handleBrgUpload = async (e) => {
    e.preventDefault();
    if (!brgMonth || !brgImage || !adminId) {
      setBrgStatus("Please select month and image.");
      return;
    }
    const formData = new FormData();
    formData.append("month", brgMonth);
    formData.append("image", brgImage);
    formData.append("imageName", brgImageName);
    formData.append("adminId", adminId);
    try {
      const res = await fetch("https://dailyvotionbackend-91wt.onrender.com/api/admin/bible-guide/image", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        setBrgStatus("Image uploaded successfully!");
        setBrgImage(null);
        setBrgImageName("");
      } else {
        setBrgStatus("Upload failed.");
      }
    } catch {
      setBrgStatus("Server error.");
    }
  };

  // Gallery album creation
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!albumName || !adminId) {
      setGalleryStatus("Album name required.");
      return;
    }
    try {
      const res = await fetch("https://dailyvotionbackend-91wt.onrender.com/api/admin/gallery/album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: albumName, adminId })
      });
      const data = await res.json();
      if (res.ok && data.albumId) {
        setCreatedAlbumId(data.albumId);
        setGalleryStatus("Album created!");
      } else {
        setGalleryStatus("Failed to create album.");
      }
    } catch {
      setGalleryStatus("Server error.");
    }
  };

  // Gallery image upload
  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (!createdAlbumId || !galleryImage || !adminId) {
      setGalleryStatus("Select album and image.");
      return;
    }
    const formData = new FormData();
    formData.append("image", galleryImage);
    formData.append("imageName", galleryImageName);
    formData.append("adminId", adminId);
    try {
      const res = await fetch(`https://dailyvotionbackend-91wt.onrender.com/api/admin/gallery/album/${createdAlbumId}/image`, {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        setGalleryStatus("Image uploaded!");
        setGalleryImage(null);
        setGalleryImageName("");
      } else {
        setGalleryStatus("Upload failed.");
      }
    } catch {
      setGalleryStatus("Server error.");
    }
  };

  return (
    <div
      className="adminaddpics-container"
      style={{
        minHeight: '100vh',
        background: "url('/JTVCF/for background picture/AdminDashboard.png') center center / cover no-repeat",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AdminTopBar
        menuItems={[
          { label: "Dashboard", link: "/admindashboard" },
          { label: "Home", link: "/" },
        ]}
      />
      <div className="adminaddpics-main">
        <div className="adminaddpics-card adminaddpics-left">
          <h2 className="adminaddpics-title">Bible Reading Guide</h2>
          <form onSubmit={handleBrgUpload} className="adminaddpics-form">
            <label className="adminaddpics-label">Month:</label>
            <select className="adminaddpics-select" value={brgMonth} onChange={e => setBrgMonth(e.target.value)} required>
              <option value="">Select Month</option>
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <label className="adminaddpics-label">Image Name (optional):</label>
            <input className="adminaddpics-input" type="text" value={brgImageName} onChange={e => setBrgImageName(e.target.value)} />
            <label className="adminaddpics-label">Upload Image:</label>
            <input className="adminaddpics-input" type="file" accept="image/*" onChange={e => setBrgImage(e.target.files[0])} required />
            <button className="adminaddpics-btn" type="submit">Upload</button>
            {brgStatus && <div className="adminaddpics-status">{brgStatus}</div>}
          </form>
        </div>
        <div className="adminaddpics-card adminaddpics-right">
          <h2 className="adminaddpics-title">Gallery Albums</h2>
          <form onSubmit={handleCreateAlbum} className="adminaddpics-form">
            <label className="adminaddpics-label">Album Name:</label>
            <input className="adminaddpics-input" type="text" value={albumName} onChange={e => setAlbumName(e.target.value)} required />
            <button className="adminaddpics-btn" type="submit">Create Album</button>
          </form>
          {createdAlbumId && (
            <form onSubmit={handleGalleryUpload} className="adminaddpics-form">
              <label className="adminaddpics-label">Image Name (optional):</label>
              <input className="adminaddpics-input" type="text" value={galleryImageName} onChange={e => setGalleryImageName(e.target.value)} />
              <label className="adminaddpics-label">Upload Image:</label>
              <input className="adminaddpics-input" type="file" accept="image/*" onChange={e => setGalleryImage(e.target.files[0])} required />
              <button className="adminaddpics-btn" type="submit">Upload to Album</button>
            </form>
          )}
          {galleryStatus && <div className="adminaddpics-status">{galleryStatus}</div>}
        </div>
      </div>
    </div>
  );
}

export default AdminAddPictures;