import React from "react";

const NavBar = () => {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      background: "rgba(0, 0, 0, 0.5)", // Semi-transparent for visibility
      color: "white",
      position: "relative",
      zIndex: 2 // Ensure it stays above the background
    }}>
      <h1 style={{ margin: 0 }}>Skin Disease Portal</h1>

      <div style={{ 
        position: "absolute", 
        left: "50%", 
        transform: "translateX(-50%)", 
        display: "flex", 
        gap: "20px"
      }}>
        <span 
          style={{ color: "white", cursor: "pointer", transition: "color 0.3s ease" }}
          onMouseOver={(e) => e.target.style.color = "blue"}
          onMouseOut={(e) => e.target.style.color = "white"}
          onClick={() => window.location.href = "/"}
        >
          Home
        </span>
        <span 
          style={{ color: "white", cursor: "pointer", transition: "color 0.3s ease" }}
          onMouseOver={(e) => e.target.style.color = "blue"}
          onMouseOut={(e) => e.target.style.color = "white"}
          onClick={() => window.location.href = "/how-it-works"}
        >
          How It Works
        </span>
      </div>

      <span 
        style={{ color: "white", cursor: "pointer", fontSize: "20px", transition: "color 0.3s ease" }}
        onMouseOver={(e) => e.target.style.color = "blue"}
        onMouseOut={(e) => e.target.style.color = "white"}
        onClick={() => window.location.href = "/user"}
      >
        <i className="fa-solid fa-users"></i>
      </span>
    </nav>
  );
};

export default NavBar;
