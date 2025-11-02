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
      const res = await fetch("/api/admin/bible-guide/image", {
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
      const res = await fetch("/api/admin/gallery/album", {
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
      const res = await fetch(`/api/admin/gallery/album/${createdAlbumId}/image`, {
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
    <div className="adminaddpics-container">
      <AdminTopBar
        menuItems={[
          { label: "Dashboard", link: "/admindashboard" },
          { label: "Home", link: "/" },
        ]}
      />
      <div className="adminaddpics-main">
        <div className="adminaddpics-left">
          <h2>Bible Reading Guide</h2>
          <form onSubmit={handleBrgUpload} style={{ marginBottom: '1.5rem' }}>
            <label>Month:</label>
            <select value={brgMonth} onChange={e => setBrgMonth(e.target.value)} required>
              <option value="">Select Month</option>
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <br />
            <label>Image Name (optional):</label>
            <input type="text" value={brgImageName} onChange={e => setBrgImageName(e.target.value)} />
            <br />
            <label>Upload Image:</label>
            <input type="file" accept="image/*" onChange={e => setBrgImage(e.target.files[0])} required />
            <br />
            <button type="submit">Upload</button>
            {brgStatus && <div style={{ marginTop: '0.7rem', color: '#008b8b' }}>{brgStatus}</div>}
          </form>
        </div>
        <div className="adminaddpics-right">
          <h2>Gallery Albums</h2>
          <form onSubmit={handleCreateAlbum} style={{ marginBottom: '1.5rem' }}>
            <label>Album Name:</label>
            <input type="text" value={albumName} onChange={e => setAlbumName(e.target.value)} required />
            <button type="submit" style={{ marginLeft: '1rem' }}>Create Album</button>
          </form>
          {createdAlbumId && (
            <form onSubmit={handleGalleryUpload}>
              <label>Image Name (optional):</label>
              <input type="text" value={galleryImageName} onChange={e => setGalleryImageName(e.target.value)} />
              <br />
              <label>Upload Image:</label>
              <input type="file" accept="image/*" onChange={e => setGalleryImage(e.target.files[0])} required />
              <br />
              <button type="submit">Upload to Album</button>
            </form>
          )}
          {galleryStatus && <div style={{ marginTop: '0.7rem', color: '#008b8b' }}>{galleryStatus}</div>}
        </div>
      </div>
    </div>
  );
}

export default AdminAddPictures;