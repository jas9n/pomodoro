import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Authenticated, NotAuthenticated } from '../components/AuthWrappers';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';


function Stats() {
    const [analytics, setAnalytics] = useState({ study_time: 0, days_logged: 0 });
    const [loading, setLoading] = useState(true);
    const { isAuthorized } = useContext(AuthContext);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('api/user/analytics/');
                setAnalytics(response.data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        // Fetch analytics only if the user is authorized
        if (isAuthorized) {
            fetchAnalytics();
        } else {
            setLoading(false); // Stop loading if not authorized
        }
    }, [isAuthorized]);

    const formatStudyTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} hours, ${mins} minutes`;
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="stats">
            <Link className="home-button" to="/">Back</Link>
            
            <Authenticated>
                <div className="analytics">
                    <p><strong>Total Study Time:</strong> {formatStudyTime(analytics.study_time)}</p>
                    <p><strong>Days Logged In:</strong> {analytics.days_logged}</p>
                </div>
            </Authenticated>

            <NotAuthenticated>
                <p>Analytics will be available when you are logged in.</p>
            </NotAuthenticated>
        </div>
    );
}

export default Stats;
