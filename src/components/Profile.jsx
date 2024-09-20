import React, { useEffect, useState } from "react";
import profileimage from "../Images/user-profile_svgrepo.com.png";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    user_id: '',  // Include user_id here
    profile: profileimage, // Default profile image
  });

  // Load profile image from localStorage on component mount
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("data"));
    const storedProfileImage = localStorage.getItem("profileImage");
    
    if (storedUserData) {
      setProfileData({
        ...storedUserData,
        profile: storedProfileImage || profileimage, // Use stored image if available
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

  // Function to convert the uploaded image to a base64 string
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setProfileData((prevData) => ({
        ...prevData,
        profile: base64String, // Update the profile image
      }));
      localStorage.setItem("profileImage", base64String); // Save the base64 string to localStorage
    };

    if (file) {
      reader.readAsDataURL(file); // Convert image to base64
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Store updated profile data in localStorage
    localStorage.setItem("data", JSON.stringify(profileData));
    alert('Profile updated successfully');
  };

  const handleLogout = () => {
    localStorage.removeItem("data");
    localStorage.removeItem("profileImage");
    window.location.href = "/"; // Navigate to login
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
            <label htmlFor="profileImage">
              <img
                className="profi-up-img rounder-corners"
                src={profileData.profile} // Display the profile image
                alt="Profile"
                style={{ width: "150px", height: "150px", cursor: "pointer" }}
              />
            </label>
            <input
              type="file"
              id="profileImage"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange} // Handle the image upload
            />
            <form onSubmit={handleUpdate}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={profileData.gender}
                  onChange={handleChange}
                  required
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
