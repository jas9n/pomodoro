import React, { createContext, useState, useContext, useEffect } from "react";

// Create Theme Context
const ThemeContext = createContext();

// Custom Hook to Access Theme
export const useTheme = () => useContext(ThemeContext);

// Theme Provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default: Light theme

  // Load saved theme from localStorage on initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to 'light' if none is saved
    setTheme(savedTheme);
    document.body.className = savedTheme; // Apply theme class to body
  }, []);

  // Function to toggle the theme
  const toggleGlobalTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Save the new theme to localStorage
    document.body.className = newTheme; // Apply theme class to body
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleGlobalTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
