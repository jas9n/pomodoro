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
  const { timers, updateTimers, resetToDefaults, loading } = useTimer();
  const { theme, toggleGlobalTheme } = useTheme();
  const { isAuthorized } = useContext(AuthContext);

  // Use string state to allow empty values during editing
  const [inputValues, setInputValues] = useState({
    pomodoro: timers.pomodoro.toString(),
    shortBreak: timers.shortBreak.toString(),
    longBreak: timers.longBreak.toString(),
  });

  useEffect(() => {
    if (!loading) {
      setInputValues({
        pomodoro: timers.pomodoro.toString(),
        shortBreak: timers.shortBreak.toString(),
        longBreak: timers.longBreak.toString(),
      });
    }
  }, [loading, timers]);

  const handleInputChange = (key, value) => {
    // Allow empty string or numbers only
    if (value === '' || /^\d*$/.test(value)) {
      setInputValues(prev => ({
        ...prev,
        [key]: value
      }));

      // Only update timer context if we have a valid number
      if (value !== '') {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
          const validValue = Math.max(1, Math.min(60, numValue));
          updateTimers({ [key]: validValue });
        }
      }
    }
  };

  const handleInputBlur = (key) => {
    const value = inputValues[key];
    let finalValue;

    if (value === '' || isNaN(parseInt(value, 10))) {
      // If empty or invalid, reset to default
      finalValue = key === 'pomodoro' ? '25' : key === 'shortBreak' ? '5' : '10';
    } else {
      // Ensure value is within bounds
      finalValue = Math.max(1, Math.min(60, parseInt(value, 10))).toString();
    }

    setInputValues(prev => ({
      ...prev,
      [key]: finalValue
    }));
    updateTimers({ [key]: parseInt(finalValue, 10) });
  };

  const handleSave = async () => {
    if (!isAuthorized) {
      setStatusMessage('You must be logged in to save your preferences.');
      return;
    }

    try {
      await api.put('/api/user/', {
        preferences: {
          timers: {
            pomodoro: parseInt(inputValues.pomodoro, 10),
            shortBreak: parseInt(inputValues.shortBreak, 10),
            longBreak: parseInt(inputValues.longBreak, 10),
          },
        },
      });

      const response = await api.get('/api/user/');
      const updatedPreferences = response.data.preferences?.timers;

      if (updatedPreferences) {
        updateTimers(updatedPreferences);
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
    const defaults = {
      pomodoro: '25',
      shortBreak: '5',
      longBreak: '10'
    };
    setInputValues(defaults);
    resetToDefaults();
    setStatusMessage('Default settings restored.');
  };

  if (loading) {
    return <p>Loading...</p>;
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
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValues.pomodoro}
                  onChange={(e) => handleInputChange('pomodoro', e.target.value)}
                  onBlur={() => handleInputBlur('pomodoro')}
                  placeholder="25"
                />
              </div>
              <div>
                <p>Short Break</p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValues.shortBreak}
                  onChange={(e) => handleInputChange('shortBreak', e.target.value)}
                  onBlur={() => handleInputBlur('shortBreak')}
                  placeholder="5"
                />
              </div>
              <div>
                <p>Long Break</p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValues.longBreak}
                  onChange={(e) => handleInputChange('longBreak', e.target.value)}
                  onBlur={() => handleInputBlur('longBreak')}
                  placeholder="10"
                />
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