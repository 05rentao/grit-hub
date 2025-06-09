import { Settings } from 'lucide-react';
import usePomodoro from '../hooks/usePomodoro.js';
import { Modes } from '../hooks/usePomodoro.js';
import { useState, useEffect, useRef } from 'react';
import { BrushCleaning } from 'lucide-react';

export default function PomodoroPage() {

  const { mode, changeMode, timeRemaining, getPrimaryButtonConfig, getSecondaryButtonConfig, editDuration, alarmRinging, settings, setAutoStartBreaks, setSoundEnabled} = usePomodoro();
  const [isEditing, setIsEditing] = useState(false);
  const audioRef = useRef(null);

  const ModeDisplay = () => {
    return (
      <div className="flex justify-around w-full border-4 border-black rounded-md">
        {[
          { label: 'Pomodoro', value: Modes.POMODORO },
          { label: 'Short Break', value: Modes.SHORT_BREAK },
          { label: 'Long Break', value: Modes.LONG_BREAK },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => changeMode(value)}
            className={`flex flex-1 justify-center items-center p-4 text-5xl transition-colors duration-300 rounded-none
              ${mode === value ? 'bg-black text-white' : 'bg-white text-black '}`}
          >
            {label}
          </button>
        ))}
      </div>
    );
  };

  useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  if (alarmRinging && settings.soundEnabled) {
    audio.loop = true;
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.error("Failed to play audio:", err);
    });
  } else {
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
  }
  }, [alarmRinging]);

  const PrimaryButton = () => {
    return (
      <button 
        onClick={getPrimaryButtonConfig().action} 
        className={` 
          p-4 rounded-md w-full
           bg-white border-4 border-black 
          hover:bg-black hover:text-white 
          transition-color duration-300 text-4xl
        ${getPrimaryButtonConfig().className}`}
      >
        {getPrimaryButtonConfig().label}
      </button>
    )
  }

  const TimerExtensionButtons = ({ onExtend }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      {[5, 10, 15].map(min => (
        <button 
          key={min}
          onClick={() => onExtend(min)}
          className="flex-1 w-1/3 py-5 rounded-md text-2xl bg-white border-4 h-full border-black 
            hover:bg-black hover:text-white transition-colors duration-300 mx-1"
        >
          +{min}
        </button>
      ))}
    </div>
  );
};

  const SecondaryButton = () => {
    const secondaryButtonConfig = getSecondaryButtonConfig();
    const [revealed, setRevealed] = useState(false);
    if (secondaryButtonConfig.key === 'extend') {
    return (
      <div className="flex flex-col justify-between w-full items-start">
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="p-4 rounded-md w-full
           bg-white border-4 border-black 
          hover:bg-black hover:text-white 
          transition-color duration-300 text-4xl"
        >
          More Time
        </button>
      ) : (
        <TimerExtensionButtons onExtend={secondaryButtonConfig.action} />
      )}
      </div>
  )}
    if (secondaryButtonConfig.key === 'skip') {
      return (
        <button 
          onClick={secondaryButtonConfig.action} 
          className="p-4 rounded-md w-full
           bg-white border-4 border-black 
          hover:bg-black hover:text-white 
          transition-color duration-300 text-4xl"
        > 
          {secondaryButtonConfig.label}
        </button>
      )
    }
    if (secondaryButtonConfig.key === 'edit') {
      // TODO: currently a placeholder for editing duration
      // TODO: make <time> component editable to change duration?
      return (
        <button 
          onClick={() => setIsEditing(true)} // Example duration
          className="p-4 rounded-md w-full
           bg-white border-4 border-black 
          hover:bg-black hover:text-white 
          transition-color duration-300 text-4xl"
        >
          {secondaryButtonConfig.label}
        </button>
      )
    }
    
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex flex-col items-center justify-center h-full w-1/2  p-4 gap-4">
        <ModeDisplay />
        <Time 
          timeRemaining={timeRemaining} 
          isEditing = {isEditing}
          editDuration={editDuration} 
          setIsEditing={setIsEditing}
       />
        <PrimaryButton />
        <SecondaryButton />
        <div className="flex flex-row items-center justify-between w-full">
          <CheckBox 
            onChange = {(e) => setAutoStartBreaks(e.target.checked)}
            value = {settings.autoStartBreaks}
            label="Auto Start Breaks"
            />
          <CheckBox 
            onChange = {(e) => setSoundEnabled(e.target.checked)}
            value = {settings.soundEnabled}
            label="Sound Enabled"
          />
          <ResetConfigs />
          <ResetPomos />
        </div>
      </div>
    <audio ref={audioRef} src="/alarm.mp3" preload="auto" />
    </div>
  )
}

export function CheckBox({ className = '', value, onChange, label }) {
  return (
    <label className='m-2 flex justify-start items-center cursor-pointer'>
      <input
        type="checkbox"
        checked={value}
        onChange={onChange}
        className={`w-6 h-6 rounded-md border-2 border-black 
          bg-white checked:bg-black checked:border-white
          ${className}`}
      />
      <span className="ml-2 text-2xl">{ label }</span>
    </label>

  );
}

export function Time ({timeRemaining, isEditing, setIsEditing, editDuration, className = '' }) {
  let minutes = Math.floor(timeRemaining / 60);
  let seconds = timeRemaining % 60;

  const [editMin, setEditMin] = useState(minutes.toString().padStart(2, '0'));
  const [editSec, setEditSec] = useState(seconds.toString().padStart(2, '0'));

  const handleSubmit = () => {
    const totalSeconds = parseInt(editMin) * 60 + parseInt(editSec);
    if (!isNaN(totalSeconds) && totalSeconds >= 0 && isEditing) {
      editDuration(totalSeconds); // callback to update timeRemaining
      setIsEditing(false);
    }
  };

  const TimeEdit = (({minutes, seconds, handleSubmit, editMin, setEditMin, editSec, setEditSec}) => {
    const secInputRef = useRef(null);

    return (
      <div className="text-3xl font-bold h-1/2 w-full flex justify-center items-center">
        <div className='
        flex h-full justify-center items-center 
        w-full text-8xl px-8 py-4 border-4  border-black rounded-md transition-colors duration-500 bg-white'> 
          <input 
            type="number"
            min="0"
            className='bg-blue-500 w-40 justify-end items-start flex'
            value={editMin}
            placeholder={minutes.toString().padStart(2, '0')}
            onChange={(e) => setEditMin(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                secInputRef.current?.focus();
              }
            }}
          /> :
          <input 
            type="number"
            min="0"
            className='bg-green-500 w-40'
            ref={secInputRef}
            value={editSec}
            placeholder={seconds.toString().padStart(2, '0')}
            onChange={(e) => setEditSec(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
          </div>
      </div>
  )});

  const TimeDisplay = (({minutes, seconds}) => {
    return (
      <div className="text-3xl font-bold h-1/2 w-full flex justify-center items-center">
        <time className={`
        flex h-full justify-center items-center 
        w-full text-8xl px-8 py-4 border-4  border-black rounded-md transition-colors duration-500 ${(minutes === 0) && (seconds === 0) ? 'bg-green-400' : 'bg-white'}`}>  
          <>
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </>
        </time>
      </div>
    )
  });

  if (isEditing) {
    return (
      <TimeEdit 
        minutes={minutes} 
        seconds={seconds} 
        handleSubmit={handleSubmit} 
        editMin={editMin} 
        setEditMin={setEditMin} 
        editSec={editSec} 
        setEditSec={setEditSec} 
      />
    );
  } else {
    return (
      <TimeDisplay 
        minutes={minutes} 
        seconds={seconds} 
      />
    );
  }
};

export function ResetConfigs() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => {
          localStorage.removeItem('mode-configs');
          window.location.reload();
        }}
        className="flex flex-col items-center group"
      >
        <BrushCleaning
          size={48}
          className="p-2 rounded-lg m-2
            bg-red-500 text-white
            hover:bg-red-700
            transition-colors duration-300 cursor-pointer"
        />
        <span className="text-xs -mt-1.5 opacity-0 group-hover:opacity-100 transition">
          configs
        </span>
      </button>
    </div>
  );
}

export function ResetPomos() {
  return (
    <div className="fixed bottom-4 right-20 z-50">
      <button
        onClick={() => {
          localStorage.removeItem('pomodoro-session');
          window.location.reload();
        }}
        className="flex flex-col items-center group"
      >
        <BrushCleaning
          size={48}
          className="p-2 rounded-lg m-2
            bg-red-500 text-white
            hover:bg-red-700
            transition-colors duration-300 cursor-pointer"
        />
        <span className="text-xs -mt-1.5 opacity-0 group-hover:opacity-100 transition">
          pomodoros
        </span>
      </button>
    </div>
  );
}