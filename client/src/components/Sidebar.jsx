import React from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

// It receives the ref from the parent
const Sidebar = ({ isOpen, user, sidebarRef }) => {
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    return (
        // The ref is now attached to the sidebar itself
        <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-profile">
                <div className="profile-avatar">
                    {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="profile-name">{user?.username}</div>
            </div>
            <ul className="sidebar-nav">
                <li className="nav-item">
                    <button className="nav-button">Friends</button>
                </li>
                <li className="nav-item">
                    <button className="nav-button">Settings</button>
                </li>
            </ul>
            <div className="sidebar-footer">
                <button onClick={logoutHandler} className="logout-button-sidebar">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;