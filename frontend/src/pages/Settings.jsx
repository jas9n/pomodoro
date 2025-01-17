import { useState } from 'react';
import { Link } from 'react-router-dom'
import { useTimer } from '../contexts/TimerContext';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/Settings.css';

function Settings() {
  // toggle for tabs
  const [activeTab, setActiveTab] = useState('timer');
  const toggleTimers = () => setActiveTab('timer');
  const toggleSounds = () => setActiveTab('sound');
  const toggleTasks = () => setActiveTab('tasks');
  const toggleThemes = () => setActiveTab('theme');

  // timer settings
  const { timers, updateTimers } = useTimer()
  const [pomodoro, setPomodoro] = useState(timers.pomodoro)
  const [shortBreak, setShortBreak] = useState(timers.shortBreak)
  const [longBreak, setLongBreak] = useState(timers.longBreak)
  
  const handleSave = () => {
    updateTimers({ pomodoro, shortBreak, longBreak })
  }


  // theme settings
  const { theme, toggleGlobalTheme } = useTheme();

  return (
    <div className="settings">
    <Link className="home-button" to="/">Back</Link>
      <div className='content'>
      <div className="list">
        <p 
          onClick={toggleTimers}
          className={`tab ${activeTab === 'timer' ? 'active' : ''}`}
        >
          Timers
        </p>
        <p 
          onClick={toggleSounds}
          className={`tab ${activeTab === 'sound' ? 'active' : ''}`}
        >
          Sounds
        </p>
        <p 
          onClick={toggleTasks}
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
        >
          Tasks
        </p>
        <p 
          onClick={toggleThemes}
          className={`tab ${activeTab === 'theme' ? 'active' : ''}`}
        >
          Theme
        </p>
      </div>
      <div className="display">
        {activeTab === 'timer' && (
          <div className="timer">
            <div>
              <p>Pomodoro</p>
              <input type="number" name="pomodoro" value={pomodoro} min='1' max='60' onChange={(e) => setPomodoro(Number(e.target.value))} onInput={(e) => e.target.value = e.target.value.replace(/^0+/, "")} />
            </div>
            <div>
              <p>Short Break</p>
              <input type="number" name="short" value={shortBreak} min='1' max='60' onChange={(e) => setShortBreak(Number(e.target.value))} onInput={(e) => e.target.value = e.target.value.replace(/^0+/, "")} />
            </div>
            <div>
              <p>Long Break</p>
              <input type="number" name="long" value={longBreak} min='1' max='60' onChange={(e) => setLongBreak(Number(e.target.value))} onInput={(e) => e.target.value = e.target.value.replace(/^0+/, "")} />
            </div>
          </div>
        )}
        {activeTab === 'sound' && (
          <p>Sound Settings</p>
        )}
        {activeTab === 'tasks' && (
          <p>Task Settings</p>
        )}
        {activeTab === 'theme' && (
          <button onClick={toggleGlobalTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        )}
      </div>
      </div>
      <div className='btns'>
        <button>Restore Default</button>
        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}

export default Settings;