import React, { useState } from "react";
import readingbook from "../Images/readingbook.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // You'll need to install axios via npm

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    phone: "",
    address: "",
    password: "",
    user_type: "", // Initially empty
    gender: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map user type to appropriate value
    const mappedUserType =
      formData.user_type === "user" ? 100 : formData.user_type === "publisher" ? 110 : 111;

    try {
      const response = await axios.post("http://localhost:2000/user/signup", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        user_type: mappedUserType,
        gender: formData.gender,
        password: formData.password,
      });
      if (response) {
        alert("Registration successful!");
        setTimeout(() => {
          navigate("/"); 
        }, 2000);
      }
    } catch (error) {
      console.error("There was an error!", error);
    } 
  };

  return (
    <section className="contact_section layout_padding">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="heading_container">
              <h2>Register</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="date"
                  placeholder="DOB"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  className="user-type-reg"
                >
                  <option value="" disabled>
                    Select User Type
                  </option>
                  <option value="user">User</option>
                  <option value="publisher">Publisher</option>
                </select>
              </div>
              <div>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                   className="user-type-reg"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="btn-box">
                <button type="submit">Register</button>
              </div>
              <div>
                <center>
                  <p>
                    Have an account?{" "}
                    <Link className="linktag-regis" to="/">
                      Login
                    </Link>
                  </p>
                </center>
              </div>
            </form>
          </div>
          <div className="col-md-6">
            <div className="img-box">
              <img className="bok-rea-register" src={readingbook} alt="Reading book" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
