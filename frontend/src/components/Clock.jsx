import { useState, useRef, useEffect } from "react";
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
    const { timers, soundSettings } = useTimer();
    const [time, setTime] = useState(timers.pomodoro * 60);
    const [isPaused, setIsPaused] = useState(true);
    const [activeTimer, setActiveTimer] = useState("pomodoro");
    const intervalId = useRef(null);
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

        if (activeTimer === "pomodoro") {
            api.post('api/user/analytics/', { study_time: timers.pomodoro })
                .then(response => {
                    console.log("Study time updated:", response.data);
                })
                .catch(error => {
                    console.error("Failed to update analytics:", error);
                });
        }
    };

    const startTimer = () => {
        if (!isPaused) return;
        setIsPaused(false);

        intervalId.current = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalId.current);
                    setIsPaused(true);
                    playAlarm();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const pauseTimer = () => {
        clearInterval(intervalId.current);
        setIsPaused(true);
    };

    const resetTimer = () => {
        clearInterval(intervalId.current);
        setIsPaused(true);
        if (activeTimer === "pomodoro") {
            setTime(timers.pomodoro * 60);
        } else if (activeTimer === "short-break") {
            setTime(timers.shortBreak * 60);
        } else if (activeTimer === "long-break") {
            setTime(timers.longBreak * 60);
        }
    };

    const switchTimer = (timerType) => {
        clearInterval(intervalId.current);
        setIsPaused(true);
        setActiveTimer(timerType);

        if (timerType === "pomodoro") {
            setTime(timers.pomodoro * 60);
        } else if (timerType === "short-break") {
            setTime(timers.shortBreak * 60);
        } else if (timerType === "long-break") {
            setTime(timers.longBreak * 60);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-4 bg-background text-color">
            {/* Timer Select */}
            <div className="flex space-x-4">
                <button
                    className={`px-4 py-2 rounded-full transition ${
                        activeTimer === "pomodoro"
                            ? "bg-primary text-color"
                            : "bg-secondary text-tertiary"
                    }`}
                    onClick={() => switchTimer("pomodoro")}
                >
                    Pomodoro
                </button>
                <button
                    className={`px-4 py-2 rounded-full transition ${
                        activeTimer === "short-break"
                             ? "bg-primary text-color"
                            : "bg-secondary text-tertiary"
                    }`}
                    onClick={() => switchTimer("short-break")}
                >
                    Short Break
                </button>
                <button
                    className={`px-4 py-2 rounded-full transition ${
                        activeTimer === "long-break"
                             ? "bg-primary text-color"
                            : "bg-secondary text-tertiary"
                    }`}
                    onClick={() => switchTimer("long-break")}
                >
                    Long Break
                </button>
            </div>

            {/* Timer Display */}
            <h1 className="clock text-7xl cursor-default">
                {formatTime(time)}
            </h1>

            {/* Timer Options */}
            <div className="flex space-x-4">
                <button
                    className="p-3 rounded-full bg-primary fill-color transition hover:opacity-70 hover:animate-pulse"
                    onClick={() => {
                        if (isPaused) startTimer();
                        else pauseTimer();
                    }}
                >
                    {isPaused ? <PlayIcon className='w-6 h-6' /> : <PauseIcon className='w-6 h-6'/>}
                </button>
                <button
                    className="p-3 rounded-full bg-primary fill-color transition hover:opacity-70 hover:animate-spin"
                    onClick={resetTimer}
                >
                    <ReloadIcon className='w-6 h-6'/>
                </button>
            </div>
        </div>
    );
}

export default Clock;
