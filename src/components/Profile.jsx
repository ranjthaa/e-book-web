import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    user_id: '',  // Include user_id here
    profile: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUserData = JSON.parse(localStorage.getItem("data"));
    console.log(storedUserData);

    if (storedUserData) {
      // Add user_id to profileData state
      setProfileData({
        ...storedUserData,
        user_id: storedUserData.id  // Set user_id from stored data
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Update profile information
      const profileResponse = await axios.post(
        `http://localhost:2000/user/update_user_info`,
        profileData
      );

      if (profileResponse.status === 200) {
        // Update localStorage with the new profile data
        localStorage.setItem("data", JSON.stringify(profileData));
        alert('Profile updated successfully');

        // If both current and new passwords are provided, attempt to change the password
        if (passwordData.current_password && passwordData.new_password) {
          const passwordResponse = await axios.post(
            `http://localhost:2000/user/change_password`,
            {
              user_id: profileData.user_id,
              email: profileData.email,
              current_password: passwordData.current_password,
              new_password: passwordData.new_password,
            }
          );

          if (passwordResponse.status === 200) {
            alert('Password updated successfully');
            // Optionally, reset the password fields
            setPasswordData({
              current_password: '',
              new_password: '',
            });
          } else {
            alert('Error updating password. Please try again.');
          }
        }
      } else {
        alert('Error updating profile. Please try again.');
      }
    } catch (error) {
      console.error("Error updating profile or password:", error);
      alert('Error updating profile or password. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("data");
    console.log("Logging out and navigating to login page");
    window.location.href = "/"; // This forces a full page reload to the login page
  };  

  return (
    <section className="contact_section layout_padding">
      <div className="container">
        <div className="row">
          <div className="col-3"></div>
          <div className="col-6">
            <div className="heading_container">
              <h2>Profile</h2>
            </div>
            <form onSubmit={handleUpdate}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name} // This value is pre-filled from state
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email} // Pre-filled from state
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone} // Pre-filled from state
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={profileData.gender} // Pre-filled from state
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Current Password</label>
                <input
                  type="password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password if changing"
                />
              </div>
              <div>
                <label>New Password</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password if changing"
                />
              </div>
              <div className="btn-box">
                <button type="submit">Update Profile</button>
              </div>
            </form>

          </div>
          <div className="col-3">
            <div className="btn-box">
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
