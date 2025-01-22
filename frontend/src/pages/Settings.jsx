import { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTimer } from '../contexts/TimerContext';
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';

import BackIcon from '../assets/icons/back.svg?react'
import VolumeOnIcon from '../assets/icons/volume-on.svg?react'
import VolumeOffIcon from '../assets/icons/volume-off.svg?react'
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
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
      setErrorMessage('Failed to play test sound. Error with sound files.');
      currentAudio.current = null;
    };

    audio.onended = () => {
      currentAudio.current = null;
    };
    
    currentAudio.current = audio;
    
    audio.play().catch(error => {
      setErrorMessage('Failed to play test sound. Please check your browser settings.');
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
      setErrorMessage('You must be logged in to save your preferences.');
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

      setSuccessMessage('Preferences saved successfully!');
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage('Session expired. Please log in again.');
      } else {
        setErrorMessage('Failed to save preferences. Please try again.');
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
    setSuccessMessage('Default settings restored.');
    };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-background text-color flex flex-col justify-center items-center h-full">
      <Link className="fixed top-6 right-6" to="/"><BackIcon className="fill-color w-8 h-8"/></Link>
      <div className="flex justify-between w-[30rem]">
        <div className="flex flex-col space-y-4">
          <p onClick={() => setActiveTab('timer')} className={` ${activeTab === 'timer' ? 'underline' : ''}`}>Timers</p>
          <p onClick={() => setActiveTab('sound')} className={`tab ${activeTab === 'sound' ? 'underline' : ''}`}>Sounds</p>
          
          <p onClick={() => setActiveTab('theme')} className={`tab ${activeTab === 'theme' ? 'underline' : ''}`}>Theme</p>
        </div>
        <div className="flex">
          {activeTab === 'timer' && (
            <div className="flex space-x-8">
              <div>
                <label>Pomodoro</label>
                <input
                  className='block py-2.5 px-3 mt-2.5 w-24 text-sm bg-transparent rounded-md border border-solid border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500'
                  type="text"
                  inputMode="numeric"
                  value={inputValues.pomodoro}
                  onChange={(e) => handleInputChange('pomodoro', e.target.value)}
                  onBlur={() => handleInputBlur('pomodoro')}
                  placeholder="25"
                />
              </div>
              <div>
                <label>Short Break</label>
                <input
                  className='block py-2.5 px-3 mt-2.5 w-24 text-sm bg-transparent rounded-md border border-solid border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500'
                  type="text"
                  inputMode="numeric"
                  value={inputValues.shortBreak}
                  onChange={(e) => handleInputChange('shortBreak', e.target.value)}
                  onBlur={() => handleInputBlur('shortBreak')}
                  placeholder="5"
                />
              </div>
              <div>
                <label>Long Break</label>
                <input  
                  className='block py-2.5 px-3 mt-2.5 w-24 text-sm bg-transparent rounded-md border border-solid border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500'
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
       <div className="flex flex-col justify-start items-start space-y-4">
       {/* Styled Select Dropdown */}
       <div className="flex justify-center items-center space-x-4">
         <p className="">Alarm Sound</p>
         <select 
           value={soundSettings.selectedSound}
           onChange={(e) => handleSoundChange(e.target.value)}
           className="bg-gray-50 border border-gray-300 text-sm rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition"
         >
           {Object.entries(SOUNDS).map(([value, { label }]) => (
             <option key={value} value={value} className="text-gray-700">
               {label}
             </option>
           ))}
         </select>
       </div>
       
       {/* Styled Volume Control */}
       <div className="volume-control space-y-4">
  <p className="">Volume - {soundSettings.volume}%</p>
  <div className="flex items-center space-x-4">
    {/* Mute/Unmute Button */}
    <button 
      onClick={handleMuteToggle} 
      className="transition"
    >
      {soundSettings.isMuted ? (
        <VolumeOnIcon className="fill-color w-6 h-6" />
      ) : (
        <VolumeOffIcon className="fill-color w-6 h-6" />
      )}
    </button>

    {/* Styled Range Input */}
    <div className="relative w-full">
      <input
        type="range"
        min="0"
        max="100"
        value={soundSettings.volume}
        onChange={(e) => handleVolumeChange(e.target.value)}
        disabled={soundSettings.isMuted}
        className={`
          appearance-none w-full h-2 rounded-lg cursor-pointer 
          ${soundSettings.isMuted ? 'bg-secondary' : 'bg-primary'}
          accent-blue-500
        `}
      />
      {/* Custom Thumb Styling */}
      <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border: none;
            border-radius: 50%;
            background: ${soundSettings.isMuted ? '#A0AEC0' : '#3b82f6'};
            cursor: pointer;
          }
          input[type="range"]::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border: none;
            border-radius: 50%;
            background: ${soundSettings.isMuted ? '#A0AEC0' : '#3b82f6'};
            cursor: pointer;
          }
        `}
      </style>
    </div>
  </div>
</div>
     
      
     </div>
      )}
      {activeTab === 'theme' && (
        <div className='flex justify-center items-center space-x-3'>
          <p>Dark Mode</p>
          <div className={`relative w-10 h-6 flex items-center ${theme === 'dark' ? 'bg-blue-500' : 'bg-gray-300'} rounded-full p-1 cursor-pointer transition`} onClick={toggleGlobalTheme}>
            <div className={`h-4 w-4 bg-white rounded-full shadow-md transform ${theme === 'dark' ? 'translate-x-4' : ''} transition`}></div>
          </div>
        </div>
      )}
        
      </div>
      </div>
      { isAuthorized && (
        <div className="flex mt-8 w-[30rem] justify-between">
          <button onClick={handleRestoreDefault} className='px-4 py-2 text-red-500 border border-solid border-red-500 rounded-md'>Restore Default</button>
          <button onClick={handleSave} className='px-4 py-2 bg-blue-500 rounded-md'>Save Changes</button>
        </div>
      )}
      {errorMessage && <div className="fixed top-12 bg-red-100 text-red-800 px-4 py-2 rounded-md">{errorMessage}</div>}
      {successMessage && <div className="fixed top-12 bg-green-100 text-green-800 px-4 py-2 rounded-md">{successMessage}</div>}
    </div>
  );
}

export default Settings;