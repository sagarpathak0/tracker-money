import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import 'font-awesome/css/font-awesome.min.css';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError("Name, email, and password are required");
    }
    try {
      const url = "http://localhost:8080/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
    }
  };

  return (
      <div className="container">
        <div className="text_login">SIGN UP</div>
        <h2>Welcome</h2>
        <p>Please enter your details to sign up.</p>
        <div className="social-login">
          <button className="social-button apple"><i className="fa fa-apple"></i> Apple</button>
          <button className="social-button google"><i className="fa fa-google"></i> Google</button>
          <button className="social-button twitter"><i className="fa fa-twitter"></i> Twitter</button>
        </div>
        <p className="or">OR</p>
        <form onSubmit={handleSignup}>
          <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            autoFocus
            placeholder="Enter your name..."
            value={signupInfo.name}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={signupInfo.email}
            />
          </div>

          <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password..."
            value={signupInfo.password}
            />
          </div>
          <button type="submit" className="glow-on-hover">Sign Up</button>
          <span className="signup-link">
            Don't have an account? <Link to="/login">Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
  );
}

export default Signup;
