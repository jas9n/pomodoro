import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

function Navbar() {
    const { isAuthorized, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const { theme } = useTheme();

    return (
        <nav className='fixed top-4 space-x-8 text-color'>
            <NavLink to="/settings">
                Settings
            </NavLink>
            <NavLink to="/stats">
                Analytics
            </NavLink>
            {!isAuthorized ? (
                <button onClick={handleLogin} className='text-blue-500'>
                    Log In
                </button>
            ) : (
                <button onClick={handleLogout} className='text-red-500'>
                    Logout
                </button>
            )}
        </nav>
    );
}

export default Navbar;
