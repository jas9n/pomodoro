import React from 'react';
import { Link } from 'react-router-dom';
import { Authenticated, NotAuthenticated } from '../components/AuthWrappers';

import '../styles/Stats.css';

function Stats() {
    return (
        <div className="stats">
            <Link className="home-button" to="/">Back</Link>
            
            <Authenticated>
                <p>These are your analytics.</p>
            </Authenticated>

            <NotAuthenticated>
                <p>Analytics will be available when you are logged in.</p>
            </NotAuthenticated>
        </div>
    );
}

export default Stats;
