import { useState, useEffect, useContext } from 'react';
import Clock from '../components/Clock';
import Navbar from '../components/Navbar';
import LoadingIcon from '../assets/icons/loading.svg?react'
import { AuthContext } from '../contexts/AuthContext';
import { useTimer } from '../contexts/TimerContext';
import api from '../api';

function Home() {
  const [name, setName] = useState('');
  const { isAuthorized, loading: authLoading } = useContext(AuthContext);
  const { timers, loading: timerLoading, displayGreeting } = useTimer();

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthorized) {
        try {
          const res = await api.get('/api/user/');
          if (res.status === 200) {
            setName(res.data.name || res.data.username);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUser();
  }, [isAuthorized]);

  if (authLoading || timerLoading) {
    return (
      <div className="bg-background flex justify-center item-center h-full">
        <LoadingIcon className="w-12 h-12 fill-color animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-full bg-background">
      <Navbar />
      {isAuthorized && displayGreeting && (
        <h2 className='text-color font-medium absolute mb-[18rem] text-3xl'>
          Hello, {name || 'User'}
        </h2>
      )}
      <Clock
        pomodoro={timers.pomodoro}
        shortBreak={timers.shortBreak}
        longBreak={timers.longBreak}
      />
    </div>
  );
}

export default Home;