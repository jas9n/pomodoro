import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar() {
    return (
        <nav>
            <Link to="/settings" className="link settings">Settings</Link>
            <Link to="/stats" className="link stats">Analytics</Link>
            <Link to="/login" className="link login">Log In</Link>
        </nav>
    )
}

export default Navbar