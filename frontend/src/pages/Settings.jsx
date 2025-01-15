import { useState } from 'react';
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext';
import '../styles/Settings.css';

function Settings() {
  const [activeTab, setActiveTab] = useState('timer');

  const toggleTimers = () => setActiveTab('timer');
  const toggleSounds = () => setActiveTab('sound');
  const toggleTasks = () => setActiveTab('tasks');
  const toggleThemes = () => setActiveTab('theme');

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
              <input type="number" name="pomodoro" defaultValue={25} />
            </div>
            <div>
              <p>Short Break</p>
              <input type="number" name="short" defaultValue={5} />
            </div>
            <div>
              <p>Long Break</p>
              <input type="number" name="long" defaultValue={10} />
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
        <button>Save Changes</button>
      </div>
    </div>
  );
}

export default Settings;