import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- IMPORT useNavigate

const LoginForm = ({ onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // <-- INITIALIZE THE HOOK

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
            
            // ** THE MAGIC HAPPENS HERE **
            // 1. Save the user data (including the token) to localStorage
            localStorage.setItem('userInfo', JSON.stringify(data));

            // 2. Redirect the user to the dashboard
            navigate('/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" className="auth-button">Login</button>
            <p className="switch-form">
                Don't have an account? <span onClick={onSwitch}>Sign up here</span>
            </p>
        </form>
    );
};

export default LoginForm;