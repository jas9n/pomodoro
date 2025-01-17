import React, { createContext, useContext, useState } from "react";

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const [timers, setTimers] = useState({
    pomodoro: 25, 
    shortBreak: 5, 
    longBreak: 10, 
  });

  const updateTimers = (newTimers) => {
    setTimers((prevTimers) => ({ ...prevTimers, ...newTimers }));
  };

  return (
    <TimerContext.Provider value={{ timers, updateTimers }}>
      {children}
    </TimerContext.Provider>
  );
};
