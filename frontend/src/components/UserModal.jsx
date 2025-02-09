import React, { useState } from 'react';
import './UserModal.css'; // Make sure you have UserModal.css

const UserModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modalContent">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                    {!isLogin && (
                        <>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" required />
                        </>
                    )}
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                    <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
                </form>
                <button type="submit" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
                </button>
            </div>
        </div>
    );
};

export default UserModal;
