import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import readingbook from '../Images/app_logo.jpeg';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    try {
      const response = await axios.post('http://localhost:2000/user/signin', { email, password });
      if (response.status === 200) {
        const userData = response.data.data;
        onLogin(userData); // Call the onLogin function passed via props
        // Redirect based on user type handled in App.js
        if (userData.user_type === 111) {
          navigate('/adminhome');
        } else if (userData.user_type === 110) {
          navigate('/publisherhome');
        } else if (userData.user_type === 100) {
          navigate('/userhome');
        }
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      alert('Error during login. Please try again.');
    }
  };

  return (
    <section className="contact_section layout_padding">
      <div className="container">
        <div className="row">
        <center><h2>Login</h2></center>
        <center><img width={150} className='lo-im' src={ readingbook} alt="" /></center>
        <div className='col-md-3'></div>
          <div className="col-md-6">
            <div className="heading_container">
            </div>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="btn-box">
                <button type="submit">Login</button>
              </div>
              <div>
                <center>
                  <p>
                    Don't have an account?{" "}
                    <Link className="linktag-regis" to="/register">
                      Signup
                    </Link>
                  </p>
                </center>
              </div>
            </form>
          </div>
          <div className="col-md-3">
            {/* <div className="img-box">
              <img className="bok-rea-login" src={readingbook} alt="Reading Book" />
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
