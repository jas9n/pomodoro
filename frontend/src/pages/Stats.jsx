import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Authenticated, NotAuthenticated } from '../components/AuthWrappers';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import BackIcon from '../assets/icons/back.svg?react'
import InfoIcon from '../assets/icons/info.svg?react'
import LoadingIcon from '../assets/icons/loading.svg?react'




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

        if (isAuthorized) {
            fetchAnalytics();
        } else {
            setLoading(false);
        }
    }, [isAuthorized]);

    const formatHours = (minutes) => {
        return Math.floor(minutes / 60);
    }

    const formatMins = (minutes) => {
        return minutes % 60;
    }

    if (loading) {
        return (
            <div className="bg-background flex justify-center item-center h-full">
                <LoadingIcon className="w-12 h-12 fill-color animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-background text-color h-full flex justify-center items-center cursor-default">
            <Link title={"Close"} className="fixed top-6 right-6" to="/"><BackIcon className="fill-secondary w-8 h-8"/></Link>
            
            <Authenticated>
                <div className="flex flex-col w-[30rem] shadow-md rounded-xl p-8">
                    <div className='flex justify-between w-full text-lg'>
                        <div className='flex justify-center items-center space-x-2'>
                            <p className='font-medium'>Total Study Time</p>
                            <div className='group relative'>
                                <InfoIcon className="cursor-pointer fill-color h-4 w-4"/>
                                <div className='hidden absolute z-10 text-xs transition group-hover:block text-center text-color bg-secondary w-60 p-2 rounded-md -top-10 transform -translate-x-1/2 -translate-y-6'>
                                    <p>Your study time will only be updated <br/> if you complete a session.</p>
                                </div>
                            </div>
                        </div>
                        <p>
                            <span className="text-blue-400">{formatHours(analytics.study_time) === 0 ? '' : formatHours(analytics.study_time)}</span>
                            {formatHours(analytics.study_time) === 0 ? "" : formatHours(analytics.study_time) === 1 ? " hour, " : " hours, "}
                            <span className="text-blue-400">{formatMins(analytics.study_time)}</span>
                            {formatMins(analytics.study_time) === 1 ? ' minute' : ' minutes'}
                        </p>
                    </div>
                    <hr className='border border-color my-2'/>
                    <div className='flex justify-between w-full text-lg'>
                        <p className='font-medium'>Days Logged In</p>
                        <p>
                            <span className="text-blue-400">{analytics.days_logged}</span>{analytics.days_logged === 1 ? " day" : " days"}
                        </p>
                    </div>
                </div>

            </Authenticated>

            <NotAuthenticated>
                <div className='font-medium text-color p-6 rounded-md shadow-md flex space-x-1'>
                    <p>Analytics will be available when you are logged in.</p>
                    <Link to="/login" className=' transition text-blue-500 hover:text-blue-400'>Log in.</Link>
                </div>
            </NotAuthenticated>
        </div>
    );
}

export default Stats;
