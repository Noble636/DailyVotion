import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

const logoPath = '/JTVCF/home page/logo v3.png'; 
const DailyVotion = () => {
  const navigate = useNavigate();
  const seekBarRef = useRef();

  // Helper to check login status
  const isUserLoggedIn = !!localStorage.getItem('userId');
  const isAdminLoggedIn = !!localStorage.getItem('adminId') || !!sessionStorage.getItem('adminUser');
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (seekBarRef.current) {
        seekBarRef.current.style.width = percent + '%';
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const animatedEls = document.querySelectorAll('.popupAnimate');
    const onScroll = () => {
      animatedEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.classList.add('popupVisible');
        } else {
          el.classList.remove('popupVisible');
        }
      });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="seekBarContainer">
        <div className="seekBar" ref={seekBarRef}></div>
      </div>
      <div className="pageContainer">
        <div className="backgroundSplit"></div>
        <div className="animatedGlow"></div>
        <div className="dailyVotionContainer">
          <div className="leftPanel">
            <div className="logoWrapper">
              <img 
                src={logoPath} 
                alt="Jesus The True Vine Christian Fellowship Logo" 
                className="logoImage"
              />
            </div>
          </div>
          <div className="rightPanel">
            <h1 className="welcomeHeader">
              Welcome to <span className="dailyVotionBrand">DailyVotion</span>
            </h1>
            <p className="bibleVerse">
              "When the time is right, I the Lord will make it happen"
            </p>
            <p className="bibleReference">
              Isaiah 60:22
            </p>
            <button 
              className="getStartedButton"
              onClick={() => {
                if (isAdminLoggedIn) {
                  navigate("/admindashboard");
                } else if (isUserLoggedIn) {
                  navigate("/profile");
                } else {
                  navigate("/login");
                }
              }}
            >
              Get Started!
            </button>
          </div>
        </div>
      </div>
      <div
        className="scrollBackgroundSection"
        style={{
          width: '100vw',
          minHeight: '100vh',
          background: "url('/JTVCF/for background picture/3.webp') center center/cover no-repeat",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div className="homepageScrollContentGrid">
          <div className="homepageGreetingBox popupAnimate">
            <span className="homepageGreetingHeader">Greetings in Christ!</span><br />
            From all of us at Jesus the True Vine Christian Fellowship, Taguig City, we warmly welcome you to <b>DailyVotion: An Interactive Digital Devotional Prayer Platform.</b> May the grace, peace, and love of our Lord Jesus Christ be with you as you begin or continue your spiritual journey with us.
          </div>
          <div className="homepageImageRight homepageGridImgTop popupAnimate">
            <img src={"/JTVCF/gallery/ministry or organization/15.jpg"} alt="Top right" className="homepageGridImg" />
          </div>
          <div className="homepageImageLeft popupAnimate">
            <img src={"/JTVCF/gallery/about us/13.jpg"} alt="Lower left" className="homepageGridImg" />
          </div>
          <div className="homepageImageRight homepageGridImgBottom popupAnimate">
            <img src={"/JTVCF/gallery/about us/7.jpg"} alt="Lower right" className="homepageGridImg" />
          </div>
        </div>
      </div>
        <div
          className="scrollBackgroundSection"
          style={{
            width: '100vw',
            minHeight: '100vh',
            background: "url('/JTVCF/for background picture/3.webp') center center/cover no-repeat",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div className="homepageScrollContentGridAlt">
            <div className="altTopLeft popupAnimate">
              <img src={'/JTVCF/home page/2.jpg'} alt="Top left" className="homepageGridImgAlt" />
            </div>
            <div className="altTopRight popupAnimate">
              <img src={'/JTVCF/home page/1.jpg'} alt="Top right" className="homepageGridImgAlt" />
            </div>
            <div className="altMiddleLeft popupAnimate">
              <img src={'/JTVCF/gallery/ministry or organization/6.jpg'} alt="Middle left" className="homepageGridImgAlt" />
            </div>
            <div className="altBottomLeft popupAnimate">
              <img src={'/JTVCF/gallery/about us/2.jpg'} alt="Bottom left" className="homepageGridImgAlt" />
            </div>
            <div className="altGreetingBox popupAnimate">
              <p>
                As you use this platform, may your heart be filled with the joy of God’s Word, your spirit be renewed through prayer, and your faith be strengthened each day. Remember that devotion is not just an act — it is a daily walk with God, a conversation with our Creator, and a reflection of His goodness in our lives.
              </p>
              <p>
                Use DailyVotion to record your reflections, lift up prayer requests, and share testimonies so we may encourage one another.
              </p>
            </div>
          </div>
        </div>
      </>
  );
};

export default DailyVotion;