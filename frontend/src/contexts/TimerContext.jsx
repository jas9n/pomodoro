import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

  const CLOCK_FONTS = [
    { value: 'roboto', label: 'Roboto Mono' },
    { value: 'courier', label: 'Courier Prime' },
    { value: 'dm', label: 'DM Mono' },
    { value: 'cutive', label: 'Cutive Mono' },
    { value: 'major', label: 'Major Mono Display' },
    { value: 'doto', label: 'Doto' },
  ];

  const [clockFont, setClockFont] = useState('roboto');

  const [timers, setTimers] = useState(defaultTimers);
  const [soundSettings, setSoundSettings] = useState(defaultSoundSettings);
  const [theme, setTheme] = useState(defaultTheme);
  const [loading, setLoading] = useState(true);

  const [displayGreeting, setDisplayGreeting] = useState(true);
  
  const [currentTimer, setCurrentTimer] = useState({
    time: null,
    type: null,
    isPaused: true,
    startTime: null
  });

  const timerIntervalRef = useRef(null);
  const { isAuthorized, loading: authLoading } = useContext(AuthContext);



  const loadPreferences = async () => {
    if (authLoading) return;

    setLoading(true);

    if (!isAuthorized) {
      setTimers(defaultTimers);
      setSoundSettings(defaultSoundSettings);
      setTheme(defaultTheme);
      setDisplayGreeting(true);
      document.documentElement.setAttribute('data-theme', defaultTheme);
      resetCurrentTimer(defaultTimers);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/user/');
      const userPreferences = response.data.preferences;

      if (userPreferences?.timers) {
        setTimers(userPreferences.timers);
        resetCurrentTimer(userPreferences.timers);
      } else {
        setTimers(defaultTimers);
        resetCurrentTimer(defaultTimers);
      }

      if (userPreferences?.sound) {
        setSoundSettings(userPreferences.sound);
      } else {
        setSoundSettings(defaultSoundSettings);
      }

      if (userPreferences?.theme) {
        setTheme(userPreferences.theme);
        document.documentElement.setAttribute('data-theme', userPreferences.theme);
      } else {
        setTheme(defaultTheme);
      }

      setDisplayGreeting(userPreferences?.displayGreeting ?? true);

      setClockFont(userPreferences?.clockFont ?? 'roboto');

    } catch (error) {
      console.error('Failed to :', error);
      setTimers(defaultTimers);
      setSoundSettings(defaultSoundSettings);
      setTheme(defaultTheme);
      resetCurrentTimer(defaultTimers);
      setDisplayGreeting(true);
      setClockFont('roboto');
    } finally {
      setLoading(false);
    }
  };

  const resetCurrentTimer = (timerConfig, timerType = 'pomodoro') => {
    // Clear any existing interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Set initial time based on timer type
    const time = 
    timerType === 'pomodoro' ? timerConfig.pomodoro * 60 : timerType === 'short-break' ? timerConfig.shortBreak * 60 : timerConfig.longBreak * 60;

    setCurrentTimer({
      time,
      type: timerType,
      isPaused: true,
      startTime: null,
      elapsedTime: 0,
    });
  };

  const updateCurrentTimer = (updates) => {
    setCurrentTimer(prev => ({ ...prev, ...updates }));
  };

  const startTimer = () => {
    if (currentTimer.isPaused) {
      const initialTime = currentTimer.time;
      const startTime = Date.now();
  
      setCurrentTimer(prev => ({
        ...prev,
        isPaused: false,
        startTime: startTime,
      }));
  
      timerIntervalRef.current = setInterval(() => {
        setCurrentTimer(prev => {
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          const remainingTime = Math.max(initialTime - elapsedSeconds, 0);
  
          if (remainingTime <= 0) {
            clearInterval(timerIntervalRef.current);
            return {
              ...prev,
              time: 0,
              isPaused: true,
              startTime: null,
            };
          }
  
          return { 
            ...prev, 
            time: remainingTime 
          };
        });
      }, 1000); 
    }
  };
  

  const pauseTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    setCurrentTimer(prev => ({
      ...prev,
      isPaused: true,
      elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000)
    }));
  };

  const resetToDefaults = () => {
    setTimers(defaultTimers);
    setSoundSettings(defaultSoundSettings);
    setTheme(defaultTheme);
    setDisplayGreeting(true);
    setClockFont('roboto');
    resetCurrentTimer(defaultTimers);
    document.documentElement.setAttribute('data-theme', defaultTheme);
  };

  const updateTimers = (newTimers) => {
    const updatedTimers = { ...timers, ...newTimers };
    setTimers(updatedTimers);
    
    if (currentTimer.type === 'pomodoro' || 
        currentTimer.type === 'short-break' || 
        currentTimer.type === 'long-break') {
      resetCurrentTimer(updatedTimers, currentTimer.type);
    }
  };

  const updateSoundSettings = (newSettings) => {
    setSoundSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  useEffect(() => {
    loadPreferences();

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isAuthorized, authLoading]);

  useEffect(() => {
    if (currentTimer.time !== null) {
      const minutes = String(Math.floor(currentTimer.time / 60)).padStart(2, '0'); 
      const seconds = String(currentTimer.time % 60).padStart(2, '0'); 
  
      document.title = `${minutes}:${seconds} - ${
        currentTimer.type === 'pomodoro'
          ? 'Pomodoro'
          : currentTimer.type === 'short-break'
          ? 'Short Break'
          : 'Long Break'
      }`;
  
      if (currentTimer.time === 0) {
        if (currentTimer.type === "pomodoro") {
          if (isAuthorized) {
            api.post('api/user/analytics/', { study_time: timers.pomodoro })
          }
          
          alert('Session complete! Take a break and recharge.')
        }

        if (currentTimer.type === 'short-break') {
          alert('Time\'s up! Ready to resume?')
        }

        if (currentTimer.type === 'long-break') {
          alert('Time\'s up! Let\'s get back to work.')
        }

        resetCurrentTimer(timers, currentTimer.type)
      }
      
    }
  }, [currentTimer]);

  return (
    <TimerContext.Provider value={{
      timers,
      updateTimers,
      soundSettings,
      updateSoundSettings,
      theme,
      setTheme,
      resetToDefaults,
      loading,
      currentTimer,
      updateCurrentTimer,
      startTimer,
      pauseTimer,
      resetCurrentTimer,
      displayGreeting,
      setDisplayGreeting,
      clockFont,
      setClockFont,
      CLOCK_FONTS
    }}>
      {children}
    </TimerContext.Provider>
  );
};