import { useState, useRef } from "react";
import "../styles/Clock.css";

function Clock() {
    const [time, setTime] = useState(25 * 60); 
    const [isPaused, setIsPaused] = useState(true); 
    const [activeTimer, setActiveTimer] = useState("pomodoro"); 
    const intervalId = useRef(null); 

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

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

    const pauseTimer = () => {
        clearInterval(intervalId.current);
        setIsPaused(true);
    };

    const resetTimer = () => {
        clearInterval(intervalId.current);
        setIsPaused(true);
        if (activeTimer === "pomodoro") {
            setTime(25 * 60);
        } else if (activeTimer === "short-break") {
            setTime(5 * 60);
        } else if (activeTimer === "long-break") {
            setTime(10 * 60);
        }
    };

    const switchTimer = (timerType) => {
        clearInterval(intervalId.current);
        setIsPaused(true);
        setActiveTimer(timerType);

        if (timerType === "pomodoro") {
            setTime(25 * 60);
        } else if (timerType === "short-break") {
            setTime(5 * 60);
        } else if (timerType === "long-break") {
            setTime(10 * 60);
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
