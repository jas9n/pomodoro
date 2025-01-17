import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); 

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'; 
    setTheme(savedTheme);
    document.body.className = savedTheme; 
  }, []);

  const toggleGlobalTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); 
    document.body.className = newTheme; 
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleGlobalTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
