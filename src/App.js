import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Usernavbar from './user/Usernavbar';
import Adminnavbar from './admin/Adminnavbar';
import Publishernavbar from './publisher/Publishernavbar';
import Login from './components/login.jsx';
import Register from './components/Register';
import Publisherhome from './publisher/publisherhome';
import Publishebook from './publisher/publishebook';
import Profile from './components/Profile';
import Adminhome from './admin/adminhome';
import Adminpublishedauthor from './admin/adminpublishedauthor';
import Adminpurchased from './admin/adminpurchased';
import Adminrevived from './admin/adminrevived';
import Adminpublisherbook from './admin/adminpublisherbook';
import Userhome from './user/userhome';
import Userviewbook from './user/userbookview';
import SingleBook from './publisher/bookdetails.jsx';
import Usersavedbooks from './user/usersavedbooks.jsx';
import Userbuyedbooks from './user/Userbuyedbooks.jsx';
import Adminviewbook from './admin/adminviewbook.jsx';
import Publisherbuyedbooks from './publisher/buyedbooks.jsx';
import Addcategory from './publisher/addcategory.jsx';
import CategoryBooks from './user/categorybooks.js';
import Userbuyedviewbook from './user/userbuyedbooksview.jsx';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("data"));
    if (storedUserData) {
      const role = storedUserData.user_type === 111 ? 'admin' :
                   storedUserData.user_type === 110 ? 'publisher' :
                   storedUserData.user_type === 100 ? 'user' :
                   null;
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    const role = userData.user_type === 111 ? 'admin' :
                 userData.user_type === 110 ? 'publisher' :
                 userData.user_type === 100 ? 'user' :
                 null;

    setUserRole(role);
    localStorage.setItem("data", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem("data");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to profile if user is logged in, or to login if not
  const RedirectBasedOnLogin = () => {
    const storedUserData = JSON.parse(localStorage.getItem("data"));
  
    if (storedUserData) {
      const userRole = storedUserData.user_type;
  
      if (userRole === 111) {
        return <Navigate to="/adminhome" />;
      } else if (userRole === 110) {
        return <Navigate to="/publisherhome" />;
      } else if (userRole === 100) {
        return <Navigate to="/userhome" />;
      }
    }
  
    // If no user data is found, redirect to the login page
    return <Navigate to="/login" />;
  };
  
  return (
    <Router>
      {/* Conditionally render the navbar based on the user's role */}
      {userRole === 'admin' && <Adminnavbar onLogout={handleLogout} />}
      {userRole === 'publisher' && <Publishernavbar onLogout={handleLogout} />}
      {userRole === 'user' && <Usernavbar onLogout={handleLogout} />}

      <Routes>
        {/* Redirect to profile if user is logged in, else show login */}
        <Route path="/" element={<RedirectBasedOnLogin />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        {userRole === 'admin' && (
          <>
            <Route path="/adminhome" element={<Adminhome />} />
            <Route path="/adminpublished" element={<Adminpublishedauthor />} />
            <Route path="/adminpurchased" element={<Adminpurchased />} />
            <Route path="/adminrevived" element={<Adminrevived />} />
            <Route path="/adminpublisherbook/:publisherId" element={<Adminpublisherbook />} />
            <Route path="/adminviewbook/:book_id" element={<Adminviewbook />} />
          </>
        )}

        {/* Publisher Routes */}
        {userRole === 'publisher' && (
          <>
            <Route path="/publisherhome" element={<Publisherhome />} />
            <Route path="/addcategory" element={<Addcategory />} />
            <Route path="/publishebook" element={<Publishebook />} />
            <Route path="/book/:book_id" element={<SingleBook />} />
            <Route path="/userbuyedbooks" element={<Publisherbuyedbooks />} />
          </>
        )}

        {/* User Routes */}
        {userRole === 'user' && (
          <>
            <Route path="/userhome" element={<Userhome />} />
            <Route path="/category/:category_name" element={<CategoryBooks />} />
            <Route path="/userviewbook/:book_id" element={<Userviewbook />} />
            <Route path="/userbuyedviewbook/:book_id" element={<Userbuyedviewbook />} />
            <Route path="/usersavedbooks" element={<Usersavedbooks />} />
            <Route path="/userbuyedbooks" element={<Userbuyedbooks />} />
          </>
        )}

        {/* Default redirect to login if no matching route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
