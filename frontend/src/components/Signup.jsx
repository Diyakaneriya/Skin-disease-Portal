import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [role, setRole] = useState("patient");

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <div className="wrapper signUp">
      <div className="illustration">
        <img src="/api/placeholder/800/600" alt="illustration" />
      </div>
      <div className="form">
        <div className="heading">CREATE AN ACCOUNT</div>
        <form>
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Enter your name" />
          </div>
          <div>
            <label htmlFor="email">E-Mail</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="role-selection">
            <label className="role-label">Select your role:</label>
            <div className="role-options">
              <div className="role-option">
                <input
                  type="radio"
                  id="patient"
                  name="role"
                  value="patient"
                  checked={role === "patient"}
                  onChange={handleRoleChange}
                />
                <label htmlFor="patient">Patient</label>
              </div>
              <div className="role-option">
                <input
                  type="radio"
                  id="doctor"
                  name="role"
                  value="doctor"
                  checked={role === "doctor"}
                  onChange={handleRoleChange}
                />
                <label htmlFor="doctor">Doctor</label>
              </div>
            </div>
          </div>
          
          <button type="submit">Submit</button>
          <h2 align="center" className="or">
            OR
          </h2>
        </form>
        <p>
          Have an account? <Link to="/"> Login </Link>
        </p>
      </div>
    </div>
  );
}