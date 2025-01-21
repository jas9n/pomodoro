import { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTimer } from '../contexts/TimerContext';
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import '../styles/Settings.css';

import alarmSound from '../assets/sounds/alarm.mp3';
import chimeSound from '../assets/sounds/chime.mp3';
import cuckoSound from '../assets/sounds/cuckoo.mp3';
import vibraSound from '../assets/sounds/vibrate.mp3';

const SOUNDS = {
  'alarm': { src: alarmSound, label: 'Alarm' },
  'chime': { src: chimeSound, label: 'Chime' },
  'cuckoo': { src: cuckoSound, label: 'Cuckoo' },
  'vibrate': { src: vibraSound, label: 'Vibrate' }
};

function Settings() {
  const [activeTab, setActiveTab] = useState('timer');
  const [statusMessage, setStatusMessage] = useState('');
  const { timers, updateTimers, soundSettings, updateSoundSettings, resetToDefaults, loading } = useTimer();
  const { theme, toggleGlobalTheme } = useTheme();
  const { isAuthorized } = useContext(AuthContext);
  const currentAudio = useRef(null);

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
    if (value === '' || /^\d*$/.test(value)) {
      setInputValues(prev => ({
        ...prev,
        [key]: value
      }));

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
      finalValue = key === 'pomodoro' ? '25' : key === 'shortBreak' ? '5' : '10';
    } else {
      finalValue = Math.max(1, Math.min(60, parseInt(value, 10))).toString();
    }

    setInputValues(prev => ({
      ...prev,
      [key]: finalValue
    }));
    updateTimers({ [key]: parseInt(finalValue, 10) });
  };

  useEffect(() => {
    return () => {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (activeTab !== 'sound') {
      stopCurrentSound();
    }
  }, [activeTab]);

  const stopCurrentSound = () => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
    }
  };

  const playTestSound = (soundName) => {
    const sound = SOUNDS[soundName];
    if (!sound) return;

    stopCurrentSound();

    const audio = new Audio(sound.src);
    audio.volume = soundSettings.isMuted ? 0 : soundSettings.volume / 100;
    
    audio.onerror = (e) => {
      console.error('Failed to load audio file:', e);
      setStatusMessage('Failed to play test sound. Please check your sound files.');
      currentAudio.current = null;
    };

    audio.onended = () => {
      currentAudio.current = null;
    };
    
    currentAudio.current = audio;
    
    audio.play().catch(error => {
      console.error('Failed to play audio:', error);
      setStatusMessage('Failed to play test sound. Please check your browser settings.');
      currentAudio.current = null;
    });
  };

  const handleSoundChange = (sound) => {
    updateSoundSettings({ selectedSound: sound });
    playTestSound(sound);
  };

  const handleVolumeChange = (volume) => {
    const newVolume = parseInt(volume, 10);
    updateSoundSettings({ volume: newVolume });
    
    if (currentAudio.current) {
      currentAudio.current.volume = soundSettings.isMuted ? 0 : newVolume / 100;
    }
  };

  const handleMuteToggle = () => {
    const newMuted = !soundSettings.isMuted;
    updateSoundSettings({ isMuted: newMuted });
    
    if (currentAudio.current) {
      currentAudio.current.volume = newMuted ? 0 : soundSettings.volume / 100;
    }
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
          sound: soundSettings,
          theme
        },
      });

      setStatusMessage('Preferences saved successfully!');
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
      longBreak: '10',
    };
  
    setInputValues(defaults);
    resetToDefaults(); 
    setStatusMessage('Default settings restored.');
  
    document.body.className = 'light';
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
          {activeTab === 'sound' && (
        <div className="sound-settings">
          <div className="sound-selector">
            <p>Alarm Sound</p>
            <select 
              value={soundSettings.selectedSound}
              onChange={(e) => handleSoundChange(e.target.value)}
              className="sound-dropdown"
            >
              {Object.entries(SOUNDS).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="volume-control">
            <p>Volume</p>
            <div className="volume-slider">
              <button onClick={handleMuteToggle}>
                {soundSettings.isMuted ? '🔇' : '🔊'}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={soundSettings.volume}
                onChange={(e) => handleVolumeChange(e.target.value)}
                disabled={soundSettings.isMuted}
              />
              <span>{soundSettings.volume}%</span>
            </div>
          </div>
        </div>
      )}
          {activeTab === 'theme' && (
            <button onClick={toggleGlobalTheme}>
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          )}
        </div>
      </div>
      { isAuthorized && (
        <div className="btns">
          <button onClick={handleRestoreDefault}>Restore Default</button>
          <button onClick={handleSave} className="save-button">Save Changes</button>
        </div>
      )}
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
}

export default Settings;