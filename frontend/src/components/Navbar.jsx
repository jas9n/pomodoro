import { Link } from 'react-router-dom'
import Auth from './Auth'
import '../styles/Navbar.css'

function Navbar() {
    return (
        <nav>
            <Link to="/settings" className="link">Settings</Link>
            <Link to="/stats" className="link">Analytics</Link>
            <Auth allowed>
                <Link to="/login" className="link">Log In</Link>
            </Auth>
            <Auth>
                <Link to="/logout" className="link login">Logout</Link>
            </Auth>
        </nav>
    )
}

export default Navbar