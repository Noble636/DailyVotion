import React, { useState } from "react";
import "../css/Gallery.css";

const albums = [
  {
    name: "Bible Reading Guide",
    folder: "/JTVCF/ALBUM/bible reading guide/",
    images: [
      "january.jpg", "february.jpg", "march.jpg", "april.jpg", "july.jpg", "august.jpg", "september.jpg", "october.jpg"
    ]
  },
  {
    name: "Cell Summit 2024",
    folder: "/JTVCF/ALBUM/cell summit 2024/",
    images: Array.from({ length: 10 }, (_, i) => `${i + 1}.jpg`)
  },
  {
    name: "JTVCF 37th Anniversary",
    folder: "/JTVCF/ALBUM/JTVCF 37th anniversary/",
    images: Array.from({ length: 11 }, (_, i) => `${i + 1}.jpg`)
  },
  {
    name: "Ministry Staff",
    folder: "/JTVCF/ALBUM/ministry staff/",
    images: Array.from({ length: 7 }, (_, i) => `${i + 1}.jpg`)
  },
  {
    name: "Water Baptism",
    folder: "/JTVCF/ALBUM/water baptism/",
    images: Array.from({ length: 12 }, (_, i) => `${i + 1}.jpg`)
  }
];

function Gallery() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  return (
    <div className="gallery-container">
      <div className="gallery-bubbles">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="gallery-bubble"
            style={{
              left: `${Math.random() * 90 + 2}%`,
              width: `${Math.random() * 32 + 18}px`,
              height: `${Math.random() * 32 + 18}px`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>
      <button className="gallery-back-btn" onClick={() => setSelectedAlbum(null)} style={{ display: selectedAlbum !== null ? "block" : "none" }}>
        ← Back
      </button>
      <button
        className="gallery-back-btn"
        style={{ top: "32px", right: "32px", left: "auto", background: "rgba(255,255,255,0.7)", display: selectedAlbum === null ? "block" : "none" }}
        onClick={() => window.location.href = "/about"}
      >
        ← Back to About
      </button>
      {selectedAlbum === null && (
        <div className="gallery-albums">
          {albums.map((album, idx) => (
            <div className="gallery-album-card" key={album.name} onClick={() => setSelectedAlbum(idx)}>
              <div className="gallery-album-title">{album.name}</div>
            </div>
          ))}
        </div>
      )}
      {selectedAlbum !== null && !fullscreenImg && (
        <div className="gallery-images" style={{ marginTop: "120px", position: "absolute", left: 0, right: 0 }}>
          {albums[selectedAlbum].images.map((img, i) => (
            <img
              key={img}
              src={albums[selectedAlbum].folder + img}
              alt={img}
              className="gallery-img-thumb"
              onClick={() => setFullscreenImg(albums[selectedAlbum].folder + img)}
            />
          ))}
        </div>
      )}
      {fullscreenImg && (
        <div className="gallery-fullscreen" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Full" className="gallery-full-img" />
        </div>
      )}
    </div>
  );
}

export default Gallery;
