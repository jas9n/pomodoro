import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
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
  const { isAuthorized } = useContext(AuthContext); // Access `isAuthorized`

  const loadPreferences = async () => {
    setLoading(true);

    // Handle logged-out state
    if (!isAuthorized) {
      console.warn('User is logged out. Resetting to defaults.');
      resetToDefaults();
      setLoading(false);
      return;
    }

    // Handle logged-in state
    try {
      const response = await api.get('/api/user/');
      const userPreferences = response.data.preferences?.timers;

      if (userPreferences) {
        setTimers(userPreferences); // Apply saved preferences
        localStorage.setItem('userPreferences', JSON.stringify(userPreferences)); // Cache preferences
      } else {
        console.warn('No saved preferences found for user. Using defaults.');
        resetToDefaults(); // Reset to defaults if no preferences
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      resetToDefaults(); // Use defaults on error
    } finally {
      setLoading(false); // Ensure loading ends
    }
  };

  const resetToDefaults = () => {
    setTimers({ ...defaultTimers }); // Reset timers to default values
    localStorage.removeItem('userPreferences'); // Clear local storage cache
    console.log('Timers reset to default:', defaultTimers);
  };

  const updateTimers = (newTimers) => {
    setTimers((prevTimers) => ({ ...prevTimers, ...newTimers }));
  };

  // Handle changes to `isAuthorized`
  useEffect(() => {
    loadPreferences();
  }, [isAuthorized]); // Runs whenever `isAuthorized` changes

  return (
    <TimerContext.Provider value={{ timers, updateTimers, resetToDefaults, loading }}>
      {children}
    </TimerContext.Provider>
  );
};
