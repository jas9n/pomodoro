import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Authenticated, NotAuthenticated } from '../components/AuthWrappers';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import BackIcon from '../assets/icons/back.svg?react'



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
        if (mins < 2) {
             return `${mins} minute`;
        } else {
            if (hours < 1) {
                return `${mins} minutes`;
            } else {
                return `${hours} hours, ${mins} minutes`;
            }
        }
    };

    const formatDays = (days) => {
        if (days < 2) {
            return `${days} day`
        } else {
            return `${days} days`
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="bg-background text-color h-full flex justify-center items-center cursor-default">
            <Link className="fixed top-6 right-6" to="/"><BackIcon className="fill-secondary w-8 h-8"/></Link>
            
            <Authenticated>
                <div className="flex flex-col w-[30rem] shadow-md rounded-xl p-8">
                    <div className='flex justify-between w-full text-lg'>
                        <p className='font-medium'>Total Study Time</p>
                        <p>{formatStudyTime(analytics.study_time)}</p>
                    </div>
                    <hr className='border border-color my-2'/>
                    <div className='flex justify-between w-full text-lg'>
                        <p className='font-medium'>Days Logged In</p>
                        <p>{formatDays(analytics.days_logged)}</p>
                    </div>
                    
                </div>
            </Authenticated>

            <NotAuthenticated>
                <div className='font-medium text-color p-6 rounded-md shadow-md'>Analytics will be available when you are logged in.</div>
            </NotAuthenticated>
        </div>
    );
}

export default Stats;
