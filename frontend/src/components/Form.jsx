import { useState, useContext } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; 
import LoadingIcon from '../assets/icons/loading.svg?react'


function Form({ route, method }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const nameLabel = method === 'login' ? 'Log In' : 'Register';

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
    
        if (method === 'register' && password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setLoading(false);
            return;
        }
    
        try {
            const payload = { username, password };
            if (method === 'register' && name.trim() !== '') {
                payload.name = name; 
            } else if (method === 'register' && name.trim() === '') {
                setErrorMessage('Name is required.');
                setLoading(false);
                return;
            }
    
            const res = await api.post(route, payload);
    
            if (res.status === 200 || res.status === 201) {
                if (method === 'register') {
                    setSuccessMessage('Registration successful. Please log in.');
                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    login(res.data.access, res.data.refresh); 
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
                    const responseErrors = error.response.data;
                    if (responseErrors.username) {
                        setErrorMessage(responseErrors.username[0]);
                    } else {
                        setErrorMessage('Missing field.');
                    }
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
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-[22rem] rounded-lg space-y-4 text-color p-12 shadow-md">
            <p className='text-3xl font-medium'>{nameLabel}</p>
                <input
                    className="block py-2.5 px-3 mt-2.5 w-full text-sm bg-transparent rounded-md border border-solid border-color bg-secondary appearance-none focus:outline-none focus:ring-0 focus:border-blue-500"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
            {method === 'register' && (
                <input
                    className="block py-2.5 px-3 mt-2.5 w-full text-sm bg-transparent rounded-md border border-solid border-color bg-secondary appearance-none focus:outline-none focus:ring-0 focus:border-blue-500"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
            )}
            <input
                className="block py-2.5 px-3 mt-2.5 w-full text-sm bg-transparent rounded-md border border-solid border-color bg-secondary appearance-none focus:outline-none focus:ring-0 focus:border-blue-500"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {method === 'register' && (
                <input
                    className="block py-2.5 px-3 mt-2.5 w-full text-sm bg-transparent rounded-md border border-solid border-color bg-secondary appearance-none focus:outline-none focus:ring-0 focus:border-blue-500"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                />
            )}
            <button
                className="w-full py-2.5 rounded-md bg-blue-500 text-white flex justify-center items-center transition hover:bg-blue-400"
                type="submit"
                disabled={loading}
            >
                {loading ? <LoadingIcon className="w-6 h-6 fill-white animate-spin" /> : nameLabel}
            </button>
    
            {errorMessage && <div className="fixed top-12 bg-red-100 text-red-800 px-4 py-2 rounded-md">{errorMessage}</div>}
            {successMessage && <div className="fixed top-12 bg-green-100 text-green-800 px-4 py-2 rounded-md">{successMessage}</div>}

            {method === 'login' && (
                <div className="flex space-x-1.5">
                    <p className='text-sm'>Don't have an account?</p>
                    <Link to="/register" className='text-sm text-blue-500'>Register here.</Link>
                </div>
            )}
            {method === 'register' && (
                <div className="flex space-x-1.5">
                    <p className='text-sm'>Already have an account?</p>
                    <Link to="/login" className='text-sm text-blue-500'>Log in.</Link>
                </div>
            )}

        </form>
    );
}

export default Form;
