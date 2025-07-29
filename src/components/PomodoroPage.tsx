import { Settings } from 'lucide-react';
import usePomodoro from '../hooks/usePomodoro.js';
import { Modes } from '../hooks/usePomodoro.js';
import { useState, useEffect, useRef } from 'react';
import { BrushCleaning } from 'lucide-react';
import ResetStorageBox from './ResetStorageButton.js';
import { ResetStorageButton } from './ResetStorageButton.js';


export default function PomodoroPage() {

  const { mode, changeMode, configs, timeRemaining, getPrimaryButtonConfig, getSecondaryButtonConfig, editDuration, alarmRinging, settings, setAutoStartBreaks, setSoundEnabled} = usePomodoro();
  const [isEditing, setIsEditing] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ModeDisplay = () => {
    return (
      <div className="flex justify-around border-4 border-border w-full rounded-md">
        {[
          { label: 'Pomodoro', value: Modes.POMODORO },
          { label: 'Short Break', value: Modes.SHORT_BREAK },
          { label: 'Long Break', value: Modes.LONG_BREAK },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => changeMode(value)}
            className={`flex flex-1 justify-center items-center p-3 text-2xl font-bold transition-colors duration-300 rounded-none
              ${mode === value ? 'bg-bg-secondary text-txt-secondary' : 'bg-bg-primary text-txt'}`}
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
        onClick={() => {
          setIsEditing(false);
          
          getPrimaryButtonConfig().action();
        }} 
        className={` 
          p-3 rounded-md w-full
          bg-bg border-4 border-border 
          hover:bg-bg-secondary hover:text-txt-secondary 
          transition-color duration-300 text-2xl font-bold
        `}
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
            className="flex-1 w-1/3 py-5 rounded-md text-2xl bg-bg border-4 h-full border-border 
              hover:bg-bg-secondary hover:text-txt-secondary transition-colors duration-300 mx-1"
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
          className="p-3 rounded-md w-full
           bg-bg border-4 border-border 
          hover:bg-bg-secondary hover:text-txt-secondary 
          transition-color duration-300 text-2xl font-bold"
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
           bg-bg border-4 border-border 
          hover:bg-bg-secondary hover:text-txt-secondary 
          transition-color duration-300 text-2xl font-bold"
        > 
          {secondaryButtonConfig.label}
        </button>
      )
    }
    if (secondaryButtonConfig.key === 'edit') {
      return (
        <button 
          onClick={() => setIsEditing(true)} 
          className="p-4 rounded-md w-full
           bg-bg border-4 border-border 
          hover:bg-bg-secondary hover:text-txt-secondary 
          transition-color duration-300 text-2xl font-bold"
        >
          {secondaryButtonConfig.label}
        </button>
      )
    }
    
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-bg text-txt">
      <div className="flex flex-col items-center justify-center h-full w-1/2 py-2 gap-4">
        <ModeDisplay />
        <Time 
          key={isEditing ? 'editing' : 'viewing'}
          timeRemaining={timeRemaining} 
          isEditing = {isEditing}
          editDuration={editDuration} 
          setIsEditing={setIsEditing}
          durations={configs[mode].duration}
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
          <ResetButtons />

        </div>
      </div>
    <audio ref={audioRef} src="/alarm.mp3" preload="auto" />
    </div>
  )
}

export function CheckBox({ className = '', value, onChange, label }) {
  return (
    <label className=' flex justify-start items-center cursor-pointer'>
      <input
        type="checkbox"
        checked={value}
        onChange={onChange}
        className={`w-6 h-6 rounded-lg bg-bg border-4 border-border
          ${className}`}
      />
      <span className="ml-2 text-xl text-txt">{ label }</span>
    </label>

  );
}

export function Time ({durations, timeRemaining, isEditing, setIsEditing, editDuration, className = '' }) {
  const format = (num: number) => num.toString().padStart(2, '0');
  let minutes = Math.floor(timeRemaining / 60);
  let seconds = timeRemaining % 60;
  let durationsMinutes = Math.floor(durations / 60);
  let durationsSeconds = durations % 60;

  const [editMin, setEditMin] = useState(format(durationsMinutes));
  const [editSec, setEditSec] = useState(format(durationsSeconds));

  const handleSubmit = () => {
    const totalSeconds = parseInt(editMin) * 60 + parseInt(editSec);
    if (!isNaN(totalSeconds) && isEditing) {
      editDuration(totalSeconds); 
      setIsEditing(false);
    }
  };

  if (isEditing) {
    console.log('resetting edit values to:', editMin, editSec);
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

export function TimeDisplay({minutes, seconds}) {
  return (
    <div className="text-3xl font-bold h-1/2 w-full flex justify-center items-center">
      <time className={`
      flex h-full justify-center items-center 
      w-full text-8xl px-8 py-4 border-4  border-border rounded-md transition-colors duration-500 ${(minutes === 0) && (seconds === 0) ? 'bg-green-400' : 'bg-bg'}`}>  
        <>
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </>
      </time>
    </div>
  )
};

export function TimeEdit({minutes, seconds, handleSubmit, editMin, setEditMin, editSec, setEditSec}) {
  const secInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="text-3xl font-bold h-1/2 w-full flex justify-center items-center">
      <div className='
      flex h-full justify-center items-center 
      w-full text-8xl px-8 py-4 border-4  border-border rounded-md transition-colors duration-500 bg-bg'> 
        <input 
          type="number"
          min="0"
          className='w-40 bg-gray-200 justify-end items-start flex'
          value={editMin ?? ''}
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
          className='w-40 bg-gray-200 flex justify-start items-start'
          ref={secInputRef}
          value={editSec ?? ''}
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
  )
};

function ResetButtons() {
    return (
      <ResetStorageBox
        buttons={[
          { storageKey: 'mode-configs', label: 'Reset Configs' },
          { storageKey: 'pomodoro-session', label: 'Pomodoros' }
        ]}
      />
    );
}