import { useState } from "react";
import UserModal from "./UserModal"; // Import UserModal

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navStyles = {
    nav: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid #f3f4f6"
    },
    container: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 16px"
    },
    flex: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "64px"
    },
    logo: {
      fontSize: "2.25rem",
      fontWeight: 600,
      background: "linear-gradient(to right, #374151, #111827)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    },
    navLinks: {
      display: "flex",
      gap: "32px"
    },
    button: {
      padding: "8px 16px",
      backgroundColor: "transparent",
      color: "#374151",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease"
    }
  };

  return (
    <>
      <nav style={navStyles.nav}>
        <div style={navStyles.container}>
          <div style={navStyles.flex}>
            <div>
              <span style={navStyles.logo}>Skin-Disease-Portal</span>
            </div>

            <div style={navStyles.navLinks}>
              <button style={navStyles.button}>Home</button>
              <button style={navStyles.button}>How to Use</button>
              <button style={navStyles.button}>Types</button>
            </div>

            <div>
              <button 
                style={navStyles.button}
                onClick={() => setIsModalOpen(true)} // Open modal on click
              >
                <i className="fa-solid fa-user"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* User Modal Component */}
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;
