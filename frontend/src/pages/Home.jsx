import { useState, useEffect, useContext } from 'react';
import Clock from '../components/Clock';
import Navbar from '../components/Navbar';
import { AuthContext } from '../contexts/AuthContext';
import { useTimer } from '../contexts/TimerContext';
import api from '../api';

function Home() {
  const [name, setName] = useState('');
  const { isAuthorized, loading: authLoading } = useContext(AuthContext);
  const { timers, loading: timerLoading } = useTimer();

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
      <div className="home">
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }

  // Display timers for both logged-in and logged-out users
  return (
    <div className="flex justify-center items-center h-full bg-background">
      <Navbar />
      {isAuthorized && <h2 className='text-color font-medium absolute mb-[18rem] text-3xl'>Hello, {name || 'User'}</h2>}
      <Clock
        pomodoro={timers.pomodoro}
        shortBreak={timers.shortBreak}
        longBreak={timers.longBreak}
      />
    </div>
  );
}

export default Home;
