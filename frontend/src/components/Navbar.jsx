import { Link, useNavigate } from 'react-router-dom';
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
        <nav className='fixed font-medium top-4 space-x-8 text-color'>
            <Link to="/settings" className={"hover:underline"}>
                Settings
            </Link>
            <Link to="/stats" className={"hover:underline"}>
                Analytics
            </Link>
            {!isAuthorized ? (
                <button onClick={handleLogin} className='transition text-blue-500 hover:text-blue-600'>
                    Log In
                </button>
            ) : (
                <button onClick={handleLogout} className='transition text-red-500 hover:text-red-600'>
                    Logout
                </button>
            )}
        </nav>
    );
}

export default Navbar;
