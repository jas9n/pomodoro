import { useState, useRef, useEffect } from "react";
import { useTimer } from "../contexts/TimerContext"; 
import api from "../api";
import "../styles/Clock.css";

import alarmSound from '../assets/sounds/alarm.mp3';
import chimeSound from '../assets/sounds/chime.mp3';
import cuckoSound from '../assets/sounds/cuckoo.mp3';
import vibraSound from '../assets/sounds/vibrate.mp3';

const SOUNDS = {
  'alarm': alarmSound,
  'chime': chimeSound,
  'cuckoo': cuckoSound,
  'vibrate': vibraSound
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

    // Switch the timer type and reset the time
    const switchTimer = (timerType) => {
        clearInterval(intervalId.current);
        setIsPaused(true);
        setActiveTimer(timerType);

        if (timerType === "pomodoro") {
            setTime(timers.pomodoro * 60); // Use work time from context
        } else if (timerType === "short-break") {
            setTime(timers.shortBreak * 60); // Use short break time from context
        } else if (timerType === "long-break") {
            setTime(timers.longBreak * 60); // Use long break time from context
        }
    };

    return (
        <div className="clock">
            <div className="clock-select">
                <div
                    id="pomodoro"
                    className={activeTimer === "pomodoro" ? "active" : ""}
                    onClick={() => switchTimer("pomodoro")}
                >
                    Pomodoro
                </div>
                <div
                    id="short-break"
                    className={activeTimer === "short-break" ? "active" : ""}
                    onClick={() => switchTimer("short-break")}
                >
                    Short Break
                </div>
                <div
                    id="long-break"
                    className={activeTimer === "long-break" ? "active" : ""}
                    onClick={() => switchTimer("long-break")}
                >
                    Long Break
                </div>
            </div>

            <div className="timer" id="time">
                {formatTime(time)}
            </div>

            <div className="options">
                <div
                    id="play"
                    onClick={() => {
                        if (isPaused) {
                            startTimer();
                        } else {
                            pauseTimer();
                        }
                    }}
                >
                    {isPaused ? "Start" : "Pause"}
                </div>
                <div id="reset" onClick={resetTimer}>
                    Reset
                </div>
            </div>
        </div>
    );
}

export default Clock;
