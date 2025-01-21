import React, { createContext, useContext } from 'react';
import { useTimer } from './TimerContext'; 

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { theme, setTheme } = useTimer(); 

  const toggleGlobalTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme); 
    document.body.className = newTheme; 
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleGlobalTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
