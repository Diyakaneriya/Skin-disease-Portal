import React, { useState } from 'react';
import './UserModal.css';
import { authService } from '../services/api';

const UserModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (isLogin) {
        // Login
        await authService.login({
          email: formData.email,
          password: formData.password
        });
        setSuccess('Logged in successfully!');
        setTimeout(() => {
          onClose();
          window.location.reload(); // Refresh to update UI based on login state
        }, 1000);
      } else {
        // Register
        await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'patient' // Default role
        });
        setSuccess('Account created successfully!');
        setTimeout(() => {
          setIsLogin(true); // Switch to login form
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="modal">
      <div className="modalContent">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label htmlFor="name">Name:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </>
          )}
          
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
          
          <button type="submit">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: '#007bff' }}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

export default UserModal;