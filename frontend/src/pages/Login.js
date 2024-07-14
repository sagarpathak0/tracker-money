import React from "react";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { handleError, handleSuccess } from "../utils";

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password are required");
    }
    try {
      const url = "https://tracker-money-api.vercel.app/auth/Login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("user", email.split("@")[0]);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="text_login">LOGIN</div>
        <h2>Welcome back</h2>
        <p>Please enter your details to sign in.</p>
        <div className="social-login">
          <button className="social-button apple">Apple</button>
          <button className="social-button google">Google</button>
          <button className="social-button twitter">Twitter</button>
        </div>
        <p className="or">OR</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">E-Mail Address</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={loginInfo.email}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={loginInfo.password}
            />
          </div>
          <button type="submit" className="glow-on-hover">Login</button>
          <span className="signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
