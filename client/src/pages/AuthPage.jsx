import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import './AuthPage.css';

const AuthPage = () => {
    const [isLoginView, setIsLoginView] = useState(true);

    const switchView = () => setIsLoginView(!isLoginView);

    return (
        <div className="auth-container">
            <div className="auth-left-panel">
                {/* This wrapper ensures text sits on top of the overlay we will add */}
                <div className="promo-content-wrapper">
                    <h1 className="app-title-fancy">DevTrial</h1>
                    <p className="app-description-fancy">
                        Your peer-to-peer platform for mastering coding interviews. Practice live, get feedback, and land your dream job.
                    </p>
                </div>
            </div>
            <div className="auth-right-panel">
                <div className="form-wrapper">
                    {isLoginView ? <LoginForm onSwitch={switchView} /> : <SignupForm onSwitch={switchView} />}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;