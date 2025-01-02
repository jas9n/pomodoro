import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import '../styles/Form.css';

function Form({ route, method }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const name = method === 'login' ? 'Log In' : 'Register';

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (method === 'register' && password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            setLoading(false);
            return;
        }

        try {
            const res = await api.post(route, { username, password });

            if (res.status === 200 || res.status === 201) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                if (method === 'register') {
                    setSuccessMessage('Registration successful.');
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else {
                    navigate('/'); 
                }
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMessage('Incorrect password or unregistered user.');
                } else if (error.response.status === 400) {
                    setErrorMessage('Invalid registration details.');
                } else {
                    setErrorMessage('An unexpected error occurred. Please try again.');
                }
            } else {
                setErrorMessage('Unable to connect to the server. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <p>{name}</p>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {method === 'register' && (
                <input
                    className="form-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                />
            )}
            <input 
                className="form-button" 
                type="submit" 
                disabled={loading}
                value={loading ? 'Loading...' : name}
            />
    
            {errorMessage && <div className="message-box error-message">{errorMessage}</div>}
            {successMessage && <div className="message-box success-message">{successMessage}</div>}

            {method === 'login' && (
                <div className="swap">
                    <p>Don't have an account?</p>
                    <Link to="/register" className='signin'>Register here.</Link>
                </div>
            )}
            {method === 'register' && (
                <div className="swap">
                    <p>Already have an account?</p>
                    <Link to="/login" className='signin'>Log in.</Link>
                </div>
            )}

        </form>
    );
}

export default Form;
