import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/Navbar.css';

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
        <nav>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'link active' : 'link'}>
                Settings
            </NavLink>
            <NavLink to="/stats" className={({ isActive }) => isActive ? 'link active' : 'link'}>
                Analytics
            </NavLink>
            {!isAuthorized ? (
                <button onClick={handleLogin} className="link">
                    Log In
                </button>
            ) : (
                <button onClick={handleLogout} className="link login">
                    Logout
                </button>
            )}
        </nav>
    );
}

export default Navbar;
