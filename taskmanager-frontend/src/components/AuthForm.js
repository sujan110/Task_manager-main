import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

function AuthForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCSRFToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/csrf/', {
                    withCredentials: true
                });
                axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
            } catch (error) {
                console.error('CSRF fetch error:', error);
                if (error.code === 'ERR_NETWORK') {
                    setError('Cannot connect to server. Please make sure the server is running.');
                }
            }
        };
        fetchCSRFToken();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError("Please enter both username and password");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/users/login/', {
                username,
                password
            });

            if (response.status === 200) {
                localStorage.setItem('username', response.data.username);
                navigate('/home');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password || !confirmPassword || !firstName) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/users/register/', {
                username,
                password,
                first_name: firstName
            });

            if (response.status === 201) {
                alert('Registration successful! Please login.');
                resetForm();
                document.getElementById('signup_toggle').checked = false;
            }
        } catch (error) {
            console.error('Signup error:', error.response?.data);
            handleError(error);
        }
    };

    const handleError = (error) => {
        setError(error.response?.data?.message || "An error occurred. Please try again.");
    };

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setError('');
    };

    const handleInputChange = (e, setter) => {
        setError('');
        setter(e.target.value);
    };

    return (
        <div className="container">
            <input id="signup_toggle" type="checkbox" />
            <form className="form">
                <div className="form_front">
                    <div className="form_details">Login</div>
                    <input 
                        type="text" 
                        className="input" 
                        placeholder="Email"
                        value={username}
                        onChange={(e) => handleInputChange(e, setUsername)}
                        required
                    />
                    <input 
                        type="password" 
                        className="input" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => handleInputChange(e, setPassword)}
                        required
                    />
                    <button className="buttons" onClick={handleLogin}>Login</button>
                    <span className="switch">
                        Don't have an account? 
                        <label htmlFor="signup_toggle" className="signup_tog">Sign Up</label>
                    </span>
                    {error && <div className="error-message">{error}</div>}
                </div>

                <div className="form_back">
                    <div className="form_details">Sign Up</div>
                    <input 
                        type="text" 
                        className="input" 
                        placeholder="UserName"
                        value={firstName}
                        onChange={(e) => handleInputChange(e, setFirstName)}
                        required
                    />
                    <input 
                        type="text" 
                        className="input" 
                        placeholder="Email"
                        value={username}
                        onChange={(e) => handleInputChange(e, setUsername)}
                        required
                    />
                    <input 
                        type="password" 
                        className="input" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => handleInputChange(e, setPassword)}
                        required
                    />
                    <input 
                        type="password" 
                        className="input" 
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => handleInputChange(e, setConfirmPassword)}
                        required
                    />
                    <button className="buttons" onClick={handleSignup}>Signup</button>
                    <span className="switch">
                        Already have an account? 
                        <label htmlFor="signup_toggle" className="signup_tog">Sign in</label>
                    </span>
                    {error && <div className="error-message">{error}</div>}
                </div>
            </form>
        </div>
    );
}

export default AuthForm;
