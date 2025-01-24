import { useEffect, useRef } from "react";
import { useTimer } from "../contexts/TimerContext"; 
import api from "../api";

import PlayIcon from '../assets/icons/play.svg?react'
import PauseIcon from '../assets/icons/pause.svg?react'
import ReloadIcon from '../assets/icons/reload.svg?react'

import alarmSound from '../assets/sounds/alarm.mp3';
import chimeSound from '../assets/sounds/chime.mp3';
import cuckoSound from '../assets/sounds/cuckoo.mp3';
import vibrateSound from '../assets/sounds/vibrate.mp3';

const SOUNDS = {
  'alarm': alarmSound,
  'chime': chimeSound,
  'cuckoo': cuckoSound,
  'vibrate': vibrateSound
};

function Clock() {
    const { 
        timers, 
        soundSettings, 
        currentTimer, 
        startTimer, 
        pauseTimer, 
        resetCurrentTimer ,
        clockFont
    } = useTimer();
    const alarmSound = useRef(null);

    useEffect(() => {
        const soundSrc = SOUNDS[soundSettings.selectedSound] || SOUNDS['alarm'];
        alarmSound.current = new Audio(soundSrc);
        alarmSound.current.volume = soundSettings.isMuted ? 0 : soundSettings.volume / 100;

        return () => {
            if (alarmSound.current) {
                alarmSound.current.pause();
                alarmSound.current = null;
            }
        };
    }, [soundSettings.selectedSound]);

    useEffect(() => {
        if (alarmSound.current) {
            alarmSound.current.volume = soundSettings.isMuted ? 0 : soundSettings.volume / 100;
        }
    }, [soundSettings.volume, soundSettings.isMuted]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const playAlarm = () => {
        if (alarmSound.current) {
            alarmSound.current.currentTime = 0;
            alarmSound.current.play();
        }

        // resetCurrentTimer(timers, currentTimer.type)

    };

    const handleTimerToggle = () => {
        if (currentTimer.isPaused) {
            startTimer();
        } else {
            pauseTimer();
        }
    };

    const switchTimer = (timerType) => {
        // Pause the current timer first
        pauseTimer();

        // Reset the timer for the selected type
        resetCurrentTimer(timers, timerType);
    };

    // Check for timer completion
    useEffect(() => {
        if (currentTimer.time === 0) {
            playAlarm();
        }
    }, [currentTimer.time]);

    return (
        <div className="flex flex-col items-center space-y-6 p-4 bg-background text-color">
            {/* Timer Select */}
            <div className="flex space-x-4">
                <button
                    className={`px-4 py-2 rounded-full transition ${
                        currentTimer.type === "pomodoro"
                            ? "bg-primary text-color"
                            : "bg-secondary text-tertiary"
                    }`}
                    onClick={() => switchTimer("pomodoro")}
                >
                    Pomodoro
                </button>
                <button
                    className={`px-4 py-2 rounded-full transition ${
                        currentTimer.type === "short-break"
                             ? "bg-primary text-color"
                            : "bg-secondary text-tertiary"
                    }`}
                    onClick={() => switchTimer("short-break")}
                >
                    Short Break
                </button>
                <button
                    className={`px-4 py-2 rounded-full transition ${
                        currentTimer.type === "long-break"
                             ? "bg-primary text-color"
                            : "bg-secondary text-tertiary"
                    }`}
                    onClick={() => switchTimer("long-break")}
                >
                    Long Break
                </button>
            </div>

            {/* Timer Display */}
            <h1 className={`font-${clockFont} text-7xl cursor-default`}>
                {formatTime(currentTimer.time)}
            </h1>

            {/* Timer Options */}
            <div className="flex space-x-4">
                <button
                    className="p-3 rounded-full bg-primary fill-color transition hover:opacity-70 hover:animate-pulse"
                    onClick={handleTimerToggle} title={currentTimer.isPaused ? "Play" : "Pause"}
                >
                    {currentTimer.isPaused ? <PlayIcon className='w-6 h-6' /> : <PauseIcon className='w-6 h-6'/>}
                </button>
                <button
                    className="p-3 rounded-full bg-primary fill-color transition hover:opacity-70 hover:animate-spin"
                    onClick={() => resetCurrentTimer(timers, currentTimer.type)} title={'Refresh'}
                >
                    <ReloadIcon className='w-6 h-6'/>
                </button>
            </div>
        </div>
    );
}

export default Clock;