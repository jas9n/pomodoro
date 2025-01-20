import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { AuthContext } from './AuthContext';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const defaultTimers = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 10,
  };

  const [timers, setTimers] = useState(defaultTimers);
  const [loading, setLoading] = useState(true);
  const { isAuthorized, loading: authLoading } = useContext(AuthContext);

  const loadPreferences = async () => {
    if (authLoading) return;

    setLoading(true);

    if (!isAuthorized) {
      setTimers(defaultTimers);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/user/');
      const userPreferences = response.data.preferences?.timers;

      if (userPreferences) {
        setTimers(userPreferences);
      } else {
        setTimers(defaultTimers);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      setTimers(defaultTimers);
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setTimers(defaultTimers);
    localStorage.removeItem('userPreferences');
  };

  const updateTimers = (newTimers) => {
    setTimers((prevTimers) => ({ ...prevTimers, ...newTimers }));
  };

  useEffect(() => {
    loadPreferences();
  }, [isAuthorized, authLoading]); 

  return (
    <TimerContext.Provider value={{ timers, updateTimers, resetToDefaults, loading }}>
      {children}
    </TimerContext.Provider>
  );
};