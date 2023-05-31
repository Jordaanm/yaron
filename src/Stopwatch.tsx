import { useState, useEffect } from 'react';
import './Stopwatch.css';

interface StopwatchSettings {
  beepUrl: string;
  beepInterval: number;
  initialDuration: number;
}


const saveStopwatchSettingsToLocalStorage = (settings: StopwatchSettings) => {
  localStorage.setItem('stopwatch', JSON.stringify(settings));
}

export const Stopwatch = () => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [beepUrl, setBeepUrl] = useState('/beep.wav');
  const [beepInterval, setBeepInterval] = useState(60);
  const [initialDuration, setInitialDuration] = useState(1800);
  const [duration, setDuration] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const start = () => {
    setIsRunning(true);
  }

  const stop = () => {
    setIsRunning(false);
  }

  const reset = () => {
    setDuration(initialDuration);
  }

  useEffect(() => {
    const stopwatchFromLocalStorageStr = localStorage.getItem('stopwatch');
    if(stopwatchFromLocalStorageStr) {
      const stopwatchFromLocalStorage = JSON.parse(stopwatchFromLocalStorageStr) as StopwatchSettings;
      updateSettings(stopwatchFromLocalStorage);
    } else {
      saveStopwatchSettingsToLocalStorage({
        beepUrl,
        beepInterval,
        initialDuration
      });
    }
    setTimeout(() => { setHasLoaded(true); }, 100);
  }, [beepInterval, beepUrl, initialDuration]);

  useEffect(() => {
    const tick = () => {
      if (isRunning) {
        const newDuration = duration - 1;
        if(newDuration % beepInterval == 0) {
          if(beepUrl) {
            playAlarm(beepUrl);
          }
        }
        
        if(newDuration <= 0) {
          setDuration(0);
          stop();
        } else {
          setDuration(duration => duration - 1);
        }
      }
    }
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [isRunning, duration, beepInterval, beepUrl]);

  const durationDisplay = formatTime(duration);

  const updateSettings = (settings: StopwatchSettings) => {
    console.log("Update Settings", settings);
    setInitialDuration(settings.initialDuration);
    setDuration(settings.initialDuration);
    setBeepInterval(settings.beepInterval);
    setBeepUrl(settings.beepUrl);
    setIsRunning(false);
    setIsDialogOpen(false);
    saveStopwatchSettingsToLocalStorage(settings);
  }

  if(!hasLoaded) {
    return <div className='stopwatch'>Loading...</div>
  }

  return (
    <div className="stopwatch">
      <h2 className="timer-display">{durationDisplay}</h2>
      <div className="controls">
        <button onClick={start}>Start</button>
        <button onClick={stop}>Pause</button>
        <button onClick={reset}>Reset</button>
        <button className="settings" onClick={() => setIsDialogOpen(true)}>Settings</button>
        <StopwatchSettings
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={updateSettings}
          {...{
            beepUrl,
            beepInterval,
            initialDuration
          }}
        />
      </div>
    </div>
  );
}

const formatTime = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const minutesDisplay = minutes < 10 ? `0${minutes}` : minutes;
  const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutesDisplay}:${secondsDisplay}`;
}

const playAlarm = (alarmUrl: string) => {
  console.log("Play Alarm", alarmUrl);
  const audio = new Audio(alarmUrl);
  audio.play();
}

interface StopwatchSettingsProps extends StopwatchSettings {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: StopwatchSettings) => void;
}

const StopwatchSettings = (props: StopwatchSettingsProps) => {
  const { isOpen, onClose, onSave } = props;
  const [beepUrl, setBeepUrl] = useState(props.beepUrl);
  const [beepInterval, setBeepInterval] = useState(props.beepInterval);
  const [initialDuration, setInitialDuration] = useState(props.initialDuration);

  const save = () => {
    onSave({
      beepUrl,
      beepInterval,
      initialDuration
    });
  }

  const openProps = isOpen ? { open: true } : {};

  return (
    <dialog {...openProps} className="stopwatch-settings">
      <div className="content">
        <h2>Settings</h2>
        <div className="form">
          <label>
            Beep URL
            <input type="text" value={beepUrl} onChange={e => setBeepUrl(e.target.value)} />
          </label>
          <label>
            Beep Interval (seconds)
            <input type="number" value={beepInterval} onChange={e => setBeepInterval(parseInt(e.target.value))} />
          </label>
          <label>
            Stopwatch Duration (seconds)
            <input type="number" value={initialDuration} onChange={e => setInitialDuration(parseInt(e.target.value))} />
          </label>
        </div>
        <div className="actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={save}>Save</button>
        </div>
      </div> 
    </dialog>
  );
}