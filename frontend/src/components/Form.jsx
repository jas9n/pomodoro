import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import '../styles/Form.css';

function Form({ route, method }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === 'login' ? 'Login' : 'Register';

    const handleSumbit = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (method === 'register' && password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // Register or Login Request
            const res = await api.post(route, { username, password });

            if (method === 'login') {
                // Login flow: Store tokens and redirect to home
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate('/');
            } else {
                // Registration flow: Auto-login after successful registration
                const loginRes = await api.post('/api/token/', { username, password });
                localStorage.setItem(ACCESS_TOKEN, loginRes.data.access);
                localStorage.setItem(REFRESH_TOKEN, loginRes.data.refresh);
                navigate('/');
            }
        } catch (error) {
            console.error('Error Details:', error.response);
            const errorMsg = error.response?.data?.detail || 'An error occurred. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSumbit} className="form-container">
            <h1>{name}</h1>
            {error && <div className="form-error">{error}</div>}
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            {method === 'register' && (
                <input
                    className="form-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                />
            )}
            <button className="form-button" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : name}
            </button>
        </form>
    );
}

export default Form;
