import { useState } from 'react';
import { Link } from 'react-router-dom'

import '../styles/Settings.css';

function Settings() {
  const [activeTab, setActiveTab] = useState('timer');

  const toggleTimer = () => setActiveTab('timer');
  const toggleSound = () => setActiveTab('sound');
  const toggleTasks = () => setActiveTab('tasks');
  const toggleTheme = () => setActiveTab('theme');

  return (
    <div className="settings">
    <Link className="home-button" to="/">Back</Link>
      <div className='content'>
      <div className="list">
        <p 
          onClick={toggleTimer}
          className={`tab ${activeTab === 'timer' ? 'active' : ''}`}
        >
          Timers
        </p>
        <p 
          onClick={toggleSound}
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
          onClick={toggleTheme}
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
          <p>Theme Settings</p>
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