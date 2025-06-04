import { useState, useEffect } from 'react';

export const Modes = {
  POMODORO: 'pomodoro',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak',
};

// modeConfigs only for internal memory, for where the timer left off, not state
const modeConfigs = {
  pomodoro: {
    label: 'Pomodoro',
    remaining: 5,
    duration: 25 * 60
  },
  shortBreak: {
    label: 'Short Break',
    remaining: 5 * 60,
    duration: 5 * 60
  },
  longBreak: {
    label: 'Long Break',
    remaining: 15 * 60,
    duration: 15 * 60
  },
};

export default function usePomodoro() {

    const [mode, setMode] = useState(Modes.POMODORO);
    const [timeRemaining, setTimeRemaining] = useState(modeConfigs[Modes.POMODORO].remaining); 
    // global variable for time remaining in the *active* session/mode
    const [isPaused, setIsPaused] = useState(false);
    const [alarmRinging, setAlarmRinging] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0); // track # of completed pomodoros (# focuses completed)

    // user preferences
    const [autoStartBreaks, setAutoStartBreaks] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    
    useEffect(() => {
        // ALRARM logic?
    }, [alarmRinging]);

    useEffect(() => {
        // decrements the timeReminaing every second
        // and rings when timeReminaing runs out.
        if (!isPaused && timeRemaining > 0) {
            const timer = setInterval(() => {
            setTimeRemaining(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }

        if (timeRemaining === 0 && !alarmRinging) {
            setIsPaused(true); // pause automatically 
            
            if (autoStartBreaks) {
                const nextMode = getNextMode(mode, completedPomodoros);
                changeMode(nextMode); // auto switch to next mode
                handleStart();
                return;
            }

            if (soundEnabled) {
                setAlarmRinging(true); // trigger alarm
            }
        }
    }, [isPaused, timeRemaining]); // whenever isPaused, timeRemaining changes

    const changeMode = (newMode) => { // user manually change mode
        setMode(newMode);
        setIsPaused(true);
        setTimeRemaining(modeConfigs[newMode].remaining);
    }

    const handlePause = () => { // when: full > timeRemaining > 0
        modeConfigs[mode].remaining = timeRemaining; 
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
        // reset timeRemaining to full duration for all modes
        modeConfigs[Modes.POMODORO].remaining = modeConfigs[Modes.POMODORO].duration;
        modeConfigs[Modes.SHORT_BREAK].remaining = modeConfigs[Modes.SHORT_BREAK].duration;
        modeConfigs[Modes.LONG_BREAK].remaining = modeConfigs[Modes.LONG_BREAK].duration;
        setIsPaused(false); // changing isPaused triggers useEffect to start the timer
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
        }
        if (isPaused && timeRemaining <= modeConfigs[mode].duration) {
            return {
                key: 'edit',
                label: 'Edit Duration',
                action: editDuration
                }
            };
        
        if (!isPaused && timeRemaining > 0) {
            return {
                key: 'skip',
                label: 'Skip To Next',
                action: SkipToNext
            }
        }
    }

    const SkipToNext = () => {
        const nextMode = getNextMode(mode, completedPomodoros);
        changeMode(nextMode);
        handleStart();
    }

    const editDuration = ( durationMin, durationSec ) => {
        const totalSeconds = durationMin * 60 + durationSec;
        if (totalSeconds > 0) {
            modeConfigs[mode].duration = totalSeconds;
            setTimeRemaining(totalSeconds);
        } else {
            alert('Duration must be greater than 0');
        }
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

        if (timeRemaining === modeConfigs[mode].duration) {
            return {
            label: `Start ${modeConfigs[mode].label}`,
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
        alarmRinging,
        autoStartBreaks,
        setAutoStartBreaks,
        soundEnabled,
        setSoundEnabled
    };
}