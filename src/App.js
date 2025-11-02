import Userfeedback from "./components/User/Userfeedback";
import Managefeedback from "./components/Admin/Managefeedback";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/HomePage";
import About from "./components/About";

// Admin imports
import AdminLogin from "./components/Admin/Adminlogin";
import AdminRegister from "./components/Admin/Adminregister";
import AdminAuth from "./components/Admin/Adminauth";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Manageuser from "./components/Admin/ManageUser";
import Managecontent from "./components/Admin/ManageContent";
import Manageprayer from "./components/Admin/Manageprayer";
import AdminFPW from "./components/Admin/AdminFPW";
import AdminAddPictures from "./components/Admin/AdminAddPictures";

// User imports
import UserLogin from "./components/User/UserLogin";
import UserRegister from "./components/User/UserRegister";
import UserProfile from "./components/User/UserProfile";
import UserJournal from "./components/User/UserJournal";
import UserEditProfile from "./components/User/UserEditProfile";
import Userprayerrequest from "./components/User/Userprayerrequest";
import UserReflection from "./components/User/Userreflection";
import UserFPW from "./components/User/UserFPW";
import Gallery from "./components/Gallery";

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage and About first */}
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />

        {/* Admin routes */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminregister" element={<AdminRegister />} />
        <Route path="/adminauth" element={<AdminAuth />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/manageuser" element={<Manageuser />} />
        <Route path="/managecontent" element={<Managecontent />} />
        <Route path="/manageprayer" element={<Manageprayer />} />
  <Route path="/managefeedback" element={<Managefeedback />} />
  <Route path="/adminaddpictures" element={<AdminAddPictures />} />
  <Route path="/forgot-password" element={<UserFPW />} />
  <Route path="/adminfpw" element={<AdminFPW />} />

        {/* User routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/journal" element={<UserJournal />} />
        <Route path="/editprofile" element={<UserEditProfile />} />
        <Route path="/userfeedback" element={<Userfeedback />} />
        <Route path="/userprayerrequest" element={<Userprayerrequest />} />
        <Route path="/userreflection" element={<UserReflection />} />
        <Route path="/forgot-password" element={<UserFPW />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;
