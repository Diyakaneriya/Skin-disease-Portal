// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Import the Navbar component
import { authService } from "../services/api"; // Import the auth service

const Admin = () => {
  const navigate = useNavigate();

  // State for user data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const adminStyles = {
    container: {
      paddingTop: "80px", // Account for fixed navbar
      minHeight: "100vh",
      backgroundColor: "#f8f9fa"
    },
    content: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px"
    },
    card: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      padding: "20px",
      marginBottom: "20px"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    th: {
      padding: "12px",
      textAlign: "left",
      borderBottom: "1px solid #ddd",
      backgroundColor: "#f1f1f1"
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #eee"
    },
    homeButton: {
      padding: "8px 16px",
      backgroundColor: "#111827",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }
  };

  // Fetch users data when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const userData = await authService.getAllUsers();
        setUsers(userData);
      } catch (err) {
        console.error('Error fetching users:', err);

        // More specific error handling
        if (err.message.includes('401')) {
          setError('Session expired. Please log in again.');
          setTimeout(() => navigate('/'), 3000);
        } else if (err.message.includes('403')) {
          setError('Admin privileges required to access this page.');
          setTimeout(() => navigate('/'), 3000);
        } else {
          setError('Failed to load users. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    // Check if user is admin before fetching
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      setError('Admin access required');
      setLoading(false);
      // Redirect to home page after a delay
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    fetchUsers();
  }, [navigate]);

  return (
    <>
      <Navbar /> {/* Include the same Navbar */}

      <div style={adminStyles.container}>
        <div style={adminStyles.content}>
          <div style={adminStyles.header}>
            <h1>Admin Dashboard</h1>
            <button
              style={adminStyles.homeButton}
              onClick={() => navigate("/")}
            >
              <i className="fa-solid fa-house"></i>
              Return to Home
            </button>
          </div>

          {/* Admin Content Sections */}
          <div style={adminStyles.card}>
            <h2>User Management</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <table style={adminStyles.table}>
                <thead>
                  <tr>
                    <th style={adminStyles.th}>ID</th>
                    <th style={adminStyles.th}>Name</th>
                    <th style={adminStyles.th}>Email</th>
                    <th style={adminStyles.th}>Role</th>
                    <th style={adminStyles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td style={adminStyles.td}>{user.id}</td>
                      <td style={adminStyles.td}>{user.name}</td>
                      <td style={adminStyles.td}>{user.email}</td>
                      <td style={adminStyles.td}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor:
                            user.role === "admin" ? "#6366f1" :
                              user.role === "doctor" ? "#10b981" : "#f59e0b",
                          color: "white"
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={adminStyles.td}>
                        <button style={{
                          padding: "4px 8px",
                          marginRight: "8px",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "4px"
                        }}>
                          Edit
                        </button>
                        <button style={{
                          padding: "4px 8px",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "4px"
                        }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Additional admin sections can be added here */}
          <div style={adminStyles.card}>
            <h2>System Analytics</h2>
            <p>Total Users: {users.length}</p>
            {/* Add charts/analytics here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;