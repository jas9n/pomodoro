import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTimer } from '../contexts/TimerContext';
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import '../styles/Settings.css';

function Settings() {
  const [activeTab, setActiveTab] = useState('timer');
  const [statusMessage, setStatusMessage] = useState('');
  const { timers, updateTimers, resetToDefaults, loading } = useTimer(); // Include loading
  const { theme, toggleGlobalTheme } = useTheme();
  const { isAuthorized } = useContext(AuthContext);

  const [pomodoro, setPomodoro] = useState(timers.pomodoro);
  const [shortBreak, setShortBreak] = useState(timers.shortBreak);
  const [longBreak, setLongBreak] = useState(timers.longBreak);

  useEffect(() => {
    if (!loading) {
      // Sync local state with TimerContext after loading
      setPomodoro(timers.pomodoro);
      setShortBreak(timers.shortBreak);
      setLongBreak(timers.longBreak);
    }
  }, [loading, timers]);

  const handleUpdate = (key, value) => {
    const val = Math.max(1, Math.min(60, Number(value)));
    updateTimers({ [key]: val });
    if (key === 'pomodoro') setPomodoro(val);
    if (key === 'shortBreak') setShortBreak(val);
    if (key === 'longBreak') setLongBreak(val);
  };

  const handleSave = async () => {
    if (!isAuthorized) {
      setStatusMessage('You must be logged in to save your preferences.');
      return;
    }

    try {
      // Save preferences via API
      await api.put('/api/user/', {
        preferences: {
          timers: {
            pomodoro,
            shortBreak,
            longBreak,
          },
        },
      });

      // Fetch updated preferences to sync with TimerContext
      const response = await api.get('/api/user/');
      const updatedPreferences = response.data.preferences?.timers;

      if (updatedPreferences) {
        updateTimers(updatedPreferences); // Sync preferences with TimerContext
        setStatusMessage('Preferences saved and updated successfully!');
      } else {
        setStatusMessage('Preferences saved, but could not fetch updated preferences.');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setStatusMessage('Session expired. Please log in again.');
      } else {
        setStatusMessage('Failed to save preferences. Please try again.');
      }
      console.error('Error:', error);
    }
  };

  const handleRestoreDefault = () => {
    resetToDefaults(); // Reset timers in TimerContext
    setPomodoro(25); // Reset local state
    setShortBreak(5);
    setLongBreak(10);
    setStatusMessage('Default settings restored.');
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading message
  }

  return (
    <div className="settings">
      <Link className="home-button" to="/">Back</Link>
      <div className="content">
        <div className="list">
          <p onClick={() => setActiveTab('timer')} className={`tab ${activeTab === 'timer' ? 'active' : ''}`}>Timers</p>
          <p onClick={() => setActiveTab('sound')} className={`tab ${activeTab === 'sound' ? 'active' : ''}`}>Sounds</p>
          <p onClick={() => setActiveTab('tasks')} className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}>Tasks</p>
          <p onClick={() => setActiveTab('theme')} className={`tab ${activeTab === 'theme' ? 'active' : ''}`}>Theme</p>
        </div>
        <div className="display">
          {activeTab === 'timer' && (
            <div className="timer">
              <div>
                <p>Pomodoro</p>
                <input type="number" value={pomodoro} min="1" max="60" onChange={(e) => handleUpdate('pomodoro', e.target.value)} />
              </div>
              <div>
                <p>Short Break</p>
                <input type="number" value={shortBreak} min="1" max="60" onChange={(e) => handleUpdate('shortBreak', e.target.value)} />
              </div>
              <div>
                <p>Long Break</p>
                <input type="number" value={longBreak} min="1" max="60" onChange={(e) => handleUpdate('longBreak', e.target.value)} />
              </div>
            </div>
          )}
          {activeTab === 'sound' && <p>Sound Settings</p>}
          {activeTab === 'tasks' && <p>Task Settings</p>}
          {activeTab === 'theme' && (
            <button onClick={toggleGlobalTheme}>
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          )}
        </div>
      </div>
      <div className="btns">
        <button onClick={handleRestoreDefault}>Restore Default</button>
        <button onClick={handleSave} className="save-button">Save Changes</button>
      </div>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
}

export default Settings;
