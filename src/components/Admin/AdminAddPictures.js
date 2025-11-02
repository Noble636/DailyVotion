import React, { useState, useEffect } from "react";
import AdminTopBar from "./AdminTopBar";
import "../../css/Admin/AdminAddPictures.css";

function AdminAddPictures() {
  // Gallery images per album
  const [albumImages, setAlbumImages] = useState({});
  // Track loading state for delete actions
  const [deletingAlbumId, setDeletingAlbumId] = useState(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState(null);
  // Gallery albums state
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [galleryImages, setGalleryImages] = useState([]); // multiple images
  const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);
  // Bible Reading Guide state
  const [brgMonth, setBrgMonth] = useState("");
  const [brgImage, setBrgImage] = useState(null);
  const [brgImageName, setBrgImageName] = useState("");
  const [brgStatus, setBrgStatus] = useState("");

  // Gallery state
  const [albumName, setAlbumName] = useState("");
  const [galleryStatus, setGalleryStatus] = useState("");
  // Fetch albums on mount
  useEffect(() => {
    fetch("https://dailyvotionbackend-91wt.onrender.com/api/gallery/albums")
      .then(res => res.json())
      .then(data => {
        setAlbums(data);
      });
  }, []);

  // Fetch images for selected album whenever selectedAlbumId changes
  useEffect(() => {
    if (!selectedAlbumId) return;
    fetch(`https://dailyvotionbackend-91wt.onrender.com/api/gallery/album/${selectedAlbumId}/images`)
      .then(res => res.json())
      .then(imgs => setAlbumImages(prev => ({ ...prev, [selectedAlbumId]: imgs })));
  }, [selectedAlbumId]);

  // Delete album handler
  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm("Are you sure you want to delete this album and all its photos?")) return;
    setDeletingAlbumId(albumId);
    try {
      const res = await fetch(`https://dailyvotionbackend-91wt.onrender.com/api/admin/gallery/album/${albumId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId })
      });
      if (res.ok) {
        setAlbums(albums.filter(a => a.id !== albumId));
        setGalleryStatus("Album deleted.");
        setAlbumImages(prev => {
          const copy = { ...prev };
          delete copy[albumId];
          return copy;
        });
        // If deleted album is selected, clear selection
        if (selectedAlbumId === albumId) setSelectedAlbumId("");
      } else {
        const error = await res.json();
        setGalleryStatus(error?.error ? error.error : "Failed to delete album.");
      }
    } catch (err) {
      setGalleryStatus("Server error: " + (err?.message || ""));
    }
    setDeletingAlbumId(null);
  };

  // Delete photo handler
  const handleDeletePhoto = async (albumId, photoId) => {
    if (!window.confirm("Delete this photo from album?")) return;
    setDeletingPhotoId(photoId);
    try {
      const res = await fetch(`https://dailyvotionbackend-91wt.onrender.com/api/admin/gallery/album/${albumId}/image/${photoId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId })
      });
      if (res.ok) {
        // Refetch images for album
        fetch(`https://dailyvotionbackend-91wt.onrender.com/api/gallery/album/${albumId}/images`)
          .then(res => res.json())
          .then(imgs => setAlbumImages(prev => ({ ...prev, [albumId]: imgs })));
        setGalleryStatus("Photo deleted.");
      } else {
        setGalleryStatus("Failed to delete photo.");
      }
    } catch {
      setGalleryStatus("Server error.");
    }
    setDeletingPhotoId(null);
  };

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
        setGalleryStatus("Album created!");
        setAlbumName("");
        // Refresh albums
        fetch("https://dailyvotionbackend-91wt.onrender.com/api/gallery/albums")
          .then(res => res.json())
          .then(data => setAlbums(data));
      } else {
        setGalleryStatus("Failed to create album.");
      }
    } catch {
      setGalleryStatus("Server error.");
    }
  };

  // Gallery image upload (multiple)
  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (!selectedAlbumId || galleryImages.length === 0 || !adminId) {
      setGalleryStatus("Select album and images.");
      return;
    }
    let successCount = 0;
    for (let i = 0; i < galleryImages.length; i++) {
      const file = galleryImages[i];
      const formData = new FormData();
      formData.append("image", file);
      formData.append("imageName", file.name);
      formData.append("adminId", adminId);
      try {
        const res = await fetch(`https://dailyvotionbackend-91wt.onrender.com/api/admin/gallery/album/${selectedAlbumId}/image`, {
          method: "POST",
          body: formData
        });
        if (res.ok) successCount++;
      } catch {}
    }
    setGalleryStatus(successCount === galleryImages.length ? "All images uploaded!" : `Uploaded ${successCount}/${galleryImages.length} images.`);
    setGalleryImages([]);
    setGalleryImagePreviews([]);
    // Refetch images for album after upload
    if (selectedAlbumId) {
      fetch(`https://dailyvotionbackend-91wt.onrender.com/api/gallery/album/${selectedAlbumId}/images`)
        .then(res => res.json())
        .then(imgs => setAlbumImages(prev => ({ ...prev, [selectedAlbumId]: imgs })));
    }
  };
  // Handle image selection and preview
  const handleGalleryImageChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages(files);
    // Preview
    const previews = files.map(file => URL.createObjectURL(file));
    setGalleryImagePreviews(previews);
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
          <form onSubmit={handleCreateAlbum} className="adminaddpics-form" style={{ marginBottom: '1.2rem' }}>
            <label className="adminaddpics-label">Create New Album:</label>
            <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
              <input className="adminaddpics-input" type="text" value={albumName} onChange={e => setAlbumName(e.target.value)} placeholder="Album Name" required />
              <button className="adminaddpics-btn" type="submit">Create Album</button>
            </div>
          </form>

          {/* Only one album select and upload form */}
          <div className="adminaddpics-form" style={{ marginBottom: '1.5rem' }}>
            <label className="adminaddpics-label">Select Album:</label>
            <select className="adminaddpics-select" value={selectedAlbumId} onChange={e => setSelectedAlbumId(e.target.value)} required>
              <option value="">Select Album</option>
              {albums.map(album => (
                <option key={album.id} value={album.id}>{album.name}</option>
              ))}
            </select>
            {/* Upload images to selected album */}
            {selectedAlbumId && (
              <form onSubmit={handleGalleryUpload} className="adminaddpics-form" style={{ marginTop: '1.5rem' }}>
                <label className="adminaddpics-label">Upload Images:</label>
                <input className="adminaddpics-input" type="file" accept="image/*" multiple onChange={handleGalleryImageChange} required />
                {/* Preview selected images */}
                {galleryImagePreviews.length > 0 && (
                  <div className="adminaddpics-preview-wrap">
                    {galleryImagePreviews.map((src, idx) => (
                      <div key={idx} className="adminaddpics-preview-imgbox">
                        <img src={src} alt={`Preview ${idx + 1}`} className="adminaddpics-preview-img" />
                      </div>
                    ))}
                  </div>
                )}
                <button className="adminaddpics-btn" type="submit">Upload to Album</button>
              </form>
            )}
          </div>

          {/* Show selected album actions and images only */}
          {selectedAlbumId && (
            <div style={{ marginBottom: '2rem', border: '1px solid #e0e0e0', borderRadius: 10, padding: '1rem', background: '#f7f8fa' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: '1.08rem', color: '#008b8b' }}>{albums.find(a => a.id === selectedAlbumId)?.name}</span>
                <button
                  className="adminaddpics-btn"
                  style={{ background: '#d32f2f', marginLeft: 12, padding: '0.4rem 1rem' }}
                  disabled={deletingAlbumId === selectedAlbumId}
                  onClick={() => handleDeleteAlbum(selectedAlbumId)}
                >
                  {deletingAlbumId === selectedAlbumId ? 'Deleting...' : 'Delete Album'}
                </button>
              </div>
              {/* Show images in selected album */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {(albumImages[selectedAlbumId] && albumImages[selectedAlbumId].length > 0) ? (
                  albumImages[selectedAlbumId].map(img => (
                    <div key={img.id} style={{ position: 'relative', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 6, width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={img.filename ? `https://dailyvotionbackend-91wt.onrender.com/uploads/${img.filename}` : (img.base64 ? img.base64 : '')}
                        alt={img.image_name || 'Photo'}
                        style={{ maxWidth: 80, maxHeight: 80, borderRadius: 6, objectFit: 'cover' }}
                        onError={e => { e.target.onerror = null; e.target.src = '/broken-image.png'; }}
                      />
                      <div style={{ position: 'absolute', bottom: 4, left: 4, right: 4, textAlign: 'center', fontSize: '0.95rem', color: '#008b8b', background: 'rgba(255,255,255,0.85)', borderRadius: 4, padding: '2px 0', fontWeight: 500 }}>{img.image_name || img.filename || 'Photo'}</div>
                      <button
                        className="adminaddpics-btn"
                        style={{ position: 'absolute', top: 4, right: 4, background: '#d32f2f', color: '#fff', fontSize: '0.85rem', padding: '2px 8px', borderRadius: 6, zIndex: 2 }}
                        disabled={deletingPhotoId === img.id}
                        onClick={() => handleDeletePhoto(selectedAlbumId, img.id)}
                      >
                        {deletingPhotoId === img.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  ))
                ) : (
                  <span style={{ color: '#888', fontSize: '0.98rem' }}>No photos in this album.</span>
                )}
              </div>
            </div>
          )}
          {/* galleryStatus message after main upload form */}
          {galleryStatus && <div className="adminaddpics-status">{galleryStatus}</div>}
        </div>
      </div>
    </div>
  );
}

export default AdminAddPictures;