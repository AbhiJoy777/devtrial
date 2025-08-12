import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = ({ onSwitch }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        try {
            const { data } = await axios.post('http://localhost:5000/api/users/register', { username, email, password });
            console.log('Registration successful:', data);
             // Automatically switch to login form after successful registration
            onSwitch();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Sign Up</h2>
            {error && <p className="error-message">{error}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
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
            <button type="submit" className="auth-button">Sign Up</button>
            <p className="switch-form">
                Already have an account? <span onClick={onSwitch}>Login here</span>
            </p>
        </form>
    );
};

export default SignupForm;