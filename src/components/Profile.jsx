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

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("data"));
    const storedProfileImage = storedUserData.profile;
    console.log(storedUserData.profile);
    

    if (storedUserData) {
      setProfileData({
        ...storedUserData,
        profile: storedProfileImage ? storedProfileImage : profileimage, // Use stored image if available, else default
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

  // Function to handle image change and upload it to the backend
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('profile', file);  // Append the file to FormData
    formData.append('user_id', profileData.id);  // Append the user_id
console.log(profileData.id);

    // Send POST request to the backend to update profile image
    const updateProfileImage = async () => {
      try {
        const response = await fetch("http://localhost:2000/user/update_profile_image", {
          method: "POST",
          body: formData,  // Send the FormData
        });

        const result = await response.json();
        if (response.ok) {
          alert("Profile image updated successfully!");

          // Update the profile image in the frontend with the URL returned by the backend
          setProfileData((prevData) => ({
            ...prevData,
            profile: result.image,  // Update the profile image with the URL from the backend
          }));

          localStorage.setItem("profileImage", result.image); // Save the profile image URL to localStorage
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        alert("Failed to update profile image. Please try again.");
      }
    };

    updateProfileImage();  // Call the function to upload the image
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
