import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

export const Modes = {
  POMODORO: 'pomodoro',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak',
};

const inticonfigs = {
  pomodoro: {
    label: 'Pomodoro',
    duration: 25 * 60
  },
  shortBreak: {
    label: 'Short Break',
    duration: 5 * 60
  },
  longBreak: {
    label: 'Long Break',
    duration: 15 * 60
  },
};

export default function usePomodoro() {

    const [configs, setConfigs] = useLocalStorage('mode-configs', inticonfigs); // configs for each mode
    const [sessionState, setSessionState] = useLocalStorage("pomodoro-session", {
        mode: Modes.POMODORO,
        remainingTime: 25 * 60,
        completedPomodoros: 0
    });

    const saveSessionState = () => {
        setSessionState({
            mode,
            remainingTime: timeRemaining,
            completedPomodoros
        });
        // autosave to localStorage in useLocalStorage hook
    }
    
    // global variable for time remaining in the *active* session/mode
    const [mode, setMode] = useState(sessionState.mode);
    const [timeRemaining, setTimeRemaining] = useState(sessionState.remainingTime);
    const [isPaused, setIsPaused] = useState(true);
    const [alarmRinging, setAlarmRinging] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0); // track # of completed pomodoros (# focuses completed)

    const sessionRef = useRef({
        mode,
        remainingTime: timeRemaining,
        completedPomodoros
    });

    // Keep sessionRef updated with latest values
    useEffect(() => {
        sessionRef.current = {
        mode,
        remainingTime: timeRemaining,
        completedPomodoros
        };
    }, [mode, timeRemaining, completedPomodoros]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem("pomodoro-session", JSON.stringify(sessionRef.current));
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            localStorage.setItem("pomodoro-session", JSON.stringify(sessionRef.current));
        };
    }, []); // ← only run once on mount

    // user preferences
    const [settings, setSettings] = useLocalStorage('pomodoro-settings', {
        autoStartBreaks: false,
        soundEnabled: true
    });

    // functions to update user preferences
    const setSoundEnabled = (enabled) => {
        setSettings(prev => ({ ...prev, soundEnabled: enabled }));
    }  

    const setAutoStartBreaks = (enabled) => {
        setSettings(prev => ({ ...prev, autoStartBreaks: enabled }));
    }

    const updateDuration = (duration) => {
        setConfigs(prevConfigs => ({
            ...prevConfigs,
            [mode]: {
                ...prevConfigs[mode],
                duration, // convert minutes to seconds
            }
        }));
    }

    //actual timer logic
    useEffect(() => {
        if (!isPaused && timeRemaining > 0) {
            const timer = setInterval(() => {
            setTimeRemaining(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }

        if (timeRemaining === 0 && !alarmRinging) {
            setIsPaused(true); // pause automatically 
            
            if (settings.autoStartBreaks) {
                const nextMode = getNextMode(mode, completedPomodoros);
                changeMode(nextMode); // auto switch to next mode
                handleStart();
                return;
            }

            if (settings.soundEnabled) {
                setAlarmRinging(true); // trigger alarm
            }
        }
    }, [isPaused, timeRemaining]); 

    const changeMode = (newMode) => { // user manually change mode
        setMode(newMode);
        setIsPaused(true);
        setTimeRemaining(configs[newMode].duration);
        saveSessionState();
    }

    const handlePause = () => { // when: full > timeRemaining > 0
        saveSessionState()
        setIsPaused(!isPaused);
    }
    
    const handleResume = () => { // full > timeRemaining > 0
        setIsPaused(false); 
    }
    
    const handleDone = () => { // timeRemaining === 0
        const nextMode = getNextMode(mode, completedPomodoros);
        changeMode(nextMode);
        setAlarmRinging(false); // reset alarm
    }

    const handleStart = () => { // timeRemaining === full
        setIsPaused(false); // changing isPaused triggers useEffect to start the timer
    }

    const editDuration = ( totalSeconds ) => {
        if (totalSeconds > 0) {
            updateDuration(totalSeconds)
            setTimeRemaining(totalSeconds);
            console.log(`Updated ${mode} duration to ${totalSeconds} seconds`);

        } else {
            alert('Duration must be greater than 0');
        }
    }

    const getNextMode = (current, completedPomodoros) => { 
        // increment completedPomodoros and mod to determine next break length
        if (current === Modes.POMODORO) {
            const newCount = completedPomodoros + 1;
            setCompletedPomodoros(newCount);
            return newCount % 4 === 0 ? Modes.LONG_BREAK : Modes.SHORT_BREAK;
        }
        return Modes.POMODORO;
    }

    const getSecondaryButtonConfig = () => {
        if (timeRemaining === 0) {
            return {
                key: 'extend',
                label: "Need More Time",
                action: extendTime
            };
        };
        if (isPaused && timeRemaining > 0) {
            return {
                key: 'edit',
                label: 'Edit Duration',
                action: editDuration
            };
        };
        
        if (!isPaused && timeRemaining > 0) {
            return {
                key: 'skip',
                label: 'Skip To Next',
                action: skipToNext
            };
        };
    }

    const skipToNext = () => {
        const nextMode = getNextMode(mode, completedPomodoros);
        changeMode(nextMode);
        handleStart();
    }

    const extendTime = (minutes) => {
        setTimeRemaining(prev => prev + minutes * 60);
        setIsPaused(false);
        setAlarmRinging(false);
    }

    const getPrimaryButtonConfig = () => {
        if (!isPaused) {
            return {
            label: 'Pause',
            action: handlePause
            };
        }

        if (timeRemaining === 0) {
            return {
                label: 'Done',
                action: handleDone
            };
        }

        if (timeRemaining === configs[mode].duration) {
            return {
            label: `Start ${configs[mode].label}`,
            action: handleStart
            };
        }

        return {
            label: 'Resume',
            action: handleResume
        };
    }
    

    return {
        mode,
        timeRemaining,
        getPrimaryButtonConfig,
        getSecondaryButtonConfig,
        editDuration,
        alarmRinging,
        changeMode,
        settings,
        setSoundEnabled,
        setAutoStartBreaks,
    };
}