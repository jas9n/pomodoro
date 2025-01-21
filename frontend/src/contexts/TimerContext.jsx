import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { AuthContext } from './AuthContext';

export const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const defaultTimers = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 10,
  };

  const defaultSoundSettings = {
    volume: 100,
    selectedSound: 'alarm',
    isMuted: false,
  };

  const defaultTheme = 'light'; 

  const [timers, setTimers] = useState(defaultTimers);
  const [soundSettings, setSoundSettings] = useState(defaultSoundSettings);
  const [theme, setTheme] = useState(defaultTheme); 
  const [loading, setLoading] = useState(true);

  const { isAuthorized, loading: authLoading } = useContext(AuthContext);

  const loadPreferences = async () => {
    if (authLoading) return;

    setLoading(true);

    if (!isAuthorized) {
      setTimers(defaultTimers);
      setSoundSettings(defaultSoundSettings);
      setTheme(defaultTheme); 
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/user/');
      const userPreferences = response.data.preferences;

      if (userPreferences?.timers) {
        setTimers(userPreferences.timers);
      } else {
        setTimers(defaultTimers);
      }

      if (userPreferences?.sound) {
        setSoundSettings(userPreferences.sound);
      } else {
        setSoundSettings(defaultSoundSettings);
      }

      if (userPreferences?.theme) {
        setTheme(userPreferences.theme);
        document.body.className = userPreferences.theme;
      } else {
        setTheme(defaultTheme);
      }

    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      setTimers(defaultTimers);
      setSoundSettings(defaultSoundSettings);
      setTheme(defaultTheme);
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setTimers(defaultTimers);
    setSoundSettings(defaultSoundSettings);
    setTheme(defaultTheme);
    document.body.className = defaultTheme;
    localStorage.removeItem('userPreferences');
  };

  const updateTimers = (newTimers) => {
    setTimers((prevTimers) => ({ ...prevTimers, ...newTimers }));
  };

  const updateSoundSettings = (newSettings) => {
    setSoundSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  useEffect(() => {
    loadPreferences();
  }, [isAuthorized, authLoading]);

  return (
    <TimerContext.Provider value={{ 
      timers, 
      updateTimers, 
      soundSettings, 
      updateSoundSettings, 
      theme, 
      setTheme, 
      resetToDefaults, 
      loading 
    }}>
      {children}
    </TimerContext.Provider>
  );
};
