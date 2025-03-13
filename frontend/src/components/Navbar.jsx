import { useState, useEffect } from "react";
import UserModal from "./UserModal";
import { authService } from "../services/api";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on component mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    window.location.reload(); // Refresh to update UI
  };

  const navStyles = {
    // Your existing styles...
    userButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: user ? "rgba(0, 123, 255, 0.1)" : "transparent",
      color: "#374151",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease"
    },
    userName: {
      marginRight: "8px",
      fontWeight: 500
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
                style={navStyles.userButton}
                onClick={user ? handleLogout : () => setIsModalOpen(true)}
              >
                {user ? (
                  <>
                    <span style={navStyles.userName}>Welcome, {user.name}</span>
                    <i className="fa-solid fa-sign-out-alt"></i>
                  </>
                ) : (
                  <i className="fa-solid fa-user"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;