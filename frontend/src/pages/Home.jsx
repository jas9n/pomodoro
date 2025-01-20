import { useState, useEffect, useContext } from 'react';
import Clock from '../components/Clock';
import Navbar from '../components/Navbar';
import { AuthContext } from '../contexts/AuthContext';
import { useTimer } from '../contexts/TimerContext';
import api from '../api';
import '../styles/Home.css';

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

  return (
    <div className="home">
      <Navbar />
      {isAuthorized && <p>Hello, {name || 'User'}</p>}
      <Clock
        pomodoro={timers.pomodoro}
        shortBreak={timers.shortBreak}
        longBreak={timers.longBreak}
      />
    </div>
  );
}

export default Home;
