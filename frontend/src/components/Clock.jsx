import { useState, useRef } from "react";
import { useTimer } from "../contexts/TimerContext"; // Import PomodoroContext
import "../styles/Clock.css";

function Clock() {
    const { timers } = useTimer(); // Access timer durations from context
    const [time, setTime] = useState(timers.pomodoro * 60); // Default to work timer
    const [isPaused, setIsPaused] = useState(true);
    const [activeTimer, setActiveTimer] = useState("pomodoro"); // Current active timer
    const intervalId = useRef(null);

    // Format time as mm:ss
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Start the timer
    const startTimer = () => {
        if (!isPaused) return;
        setIsPaused(false);

        intervalId.current = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalId.current);
                    setIsPaused(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    // Pause the timer
    const pauseTimer = () => {
        clearInterval(intervalId.current);
        setIsPaused(true);
    };

    // Reset the timer to its initial value based on the active timer
    const resetTimer = () => {
        clearInterval(intervalId.current);
        setIsPaused(true);
        if (activeTimer === "pomodoro") {
            setTime(timers.pomodoro * 60); // Use work time from context
        } else if (activeTimer === "short-break") {
            setTime(timers.shortBreak * 60); // Use short break time from context
        } else if (activeTimer === "long-break") {
            setTime(timers.longBreak * 60); // Use long break time from context
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
