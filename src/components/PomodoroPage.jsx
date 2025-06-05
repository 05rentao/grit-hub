import { Settings } from 'lucide-react';
import usePomodoro from '../hooks/usePomodoro.js';
import { Modes } from '../hooks/usePomodoro.js';
import { useState, useEffect, useRef } from 'react';



export default function PomodoroPage() {

  const { mode, changeMode, timeRemaining, getPrimaryButtonConfig, getSecondaryButtonConfig, alarmRinging, settings, setAutoStartBreaks, setSoundEnabled} = usePomodoro();
  const audioRef = useRef(null);

  const ModeDisplay = () => {
    return (
      <div className="flex justify-around w-full border-4 border-black rounded-md">
        {[
          { label: 'Pomodoro', value: Modes.POMODORO },
          { label: 'Short Break', value: Modes.SHORT_BREAK },
          { label: 'Long Break', value: Modes.LONG_BREAK },
        ].map(({ label, value }) => (
          <span
            key={value}
            className={`flex flex-1 justify-center items-center p-4 text-5xl transition-colors duration-300
              ${mode === value ? 'bg-black text-white' : 'bg-white text-black '}`}
          >
            {label}
          </span>
        ))}
      </div>
    );
  };

  const Time = ( className = '' ) => {
    return (
      <div className="text-3xl font-bold h-1/2 w-full flex justify-center items-center">
        <time className={`flex h-full justify-center items-center 
        w-full text-8xl px-8 py-4 border-4  border-black rounded-md transition-colors duration-500 ${timeRemaining === 0 ? 'bg-green-400' : 'bg-white'}`}> 
          {Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:
          {(timeRemaining % 60).toString().padStart(2, '0')}
        </time>
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
          onClick={() => secondaryButtonConfig.action(25, 0)} // Example duration
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
        <Time />
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