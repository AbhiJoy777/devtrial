import React, { useState } from 'react';
import './LobbyModal.css';

// This component takes functions to handle role selection and closing the modal
const LobbyModal = ({ onSelectRole, onClose }) => {
    const [status, setStatus] = useState('selecting'); // 'selecting' or 'waiting'

    const handleRoleSelect = (role) => {
        setStatus('waiting');
        onSelectRole(role);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {status === 'selecting' && (
                    <>
                        <h2>Choose Your Role</h2>
                        <div className="role-buttons">
                            <button onClick={() => handleRoleSelect('candidate')}>
                                👩‍💻 Candidate
                            </button>
                            <button onClick={() => handleRoleSelect('interviewer')}>
                                👨‍🏫 Interviewer
                            </button>
                        </div>
                        <button className="close-button" onClick={onClose}>Cancel</button>
                    </>
                )}

                {status === 'waiting' && (
                    <div className="waiting-status">
                        <h2>Waiting for a match...</h2>
                        <div className="spinner"></div>
                        <p>This may take a moment. We're finding the perfect partner for your session.</p>
                        <button className="close-button" onClick={onClose}>Cancel Search</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LobbyModal;