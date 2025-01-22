import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Stats from "./pages/Stats";
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from "./contexts/ThemeContext";
import { TimerProvider } from "./contexts/TimerContext";

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ logout }) => (
          <TimerProvider logout={logout}>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </TimerProvider>
        )}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

export default App;
