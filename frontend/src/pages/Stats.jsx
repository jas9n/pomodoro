import Auth from "../components/Auth"
import { Link } from 'react-router-dom'

import '../styles/Stats.css'

function Stats() {
    return (
        <div className="stats">
            <Link className="home-button" to="/">Back</Link>
            <Auth>
                These are your analytics.
            </Auth>
            <Auth allowed>
                Analytics will be available when you are logged in.
            </Auth>
        </div>
    )
}

export default Stats