import { useState, useEffect, useCallback, useContext } from 'react';
import './Stopwatch.css';
import { TimerContext } from './contexts/timer-context';
import { formatTime } from './util';

interface StopwatchSettings {
  beepUrl: string;
  beepInterval: number;
  initialDuration: number;
}


const saveStopwatchSettingsToLocalStorage = (settings: StopwatchSettings) => {
  localStorage.setItem('stopwatch', JSON.stringify(settings));
}

export const Stopwatch = () => {
  const { duration, setDuration } = useContext(TimerContext);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [beepUrl, setBeepUrl] = useState('beep.wav');
  const [beepInterval, setBeepInterval] = useState(60);
  const [maxTime, setMaxTime] = useState(1800);
  const [isRunning, setIsRunning] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const start = () => {
    setIsRunning(true);
  }

  const stop = useCallback(() => {
    setIsRunning(false);
  }, [setIsRunning])

  const reset = () => {
    setDuration(0);
  }

  const updateSettings = useCallback((settings: StopwatchSettings) => {
    setMaxTime(settings.initialDuration);
    setDuration(0);
    setBeepInterval(settings.beepInterval);
    setBeepUrl(settings.beepUrl);
    setIsRunning(false);
    setIsDialogOpen(false);
    saveStopwatchSettingsToLocalStorage(settings);
  }, [setDuration]);

  useEffect(() => {
    const stopwatchFromLocalStorageStr = localStorage.getItem('stopwatch');
    if(stopwatchFromLocalStorageStr) {
      const stopwatchFromLocalStorage = JSON.parse(stopwatchFromLocalStorageStr) as StopwatchSettings;
      updateSettings(stopwatchFromLocalStorage);
    } else {
      saveStopwatchSettingsToLocalStorage({
        beepUrl,
        beepInterval,
        initialDuration: maxTime
      });
    }
    setTimeout(() => { 
      setHasLoaded(true); 
    }, 100);
  }, [beepInterval, beepUrl, maxTime, updateSettings]);

  useEffect(() => {
    const tick = () => {
      if (isRunning) {
        const newDuration = duration + 1;
        if(newDuration % beepInterval == 0) {
          if(beepUrl) {
            playAlarm(beepUrl);
          }
        }
        
        if(newDuration > maxTime) {
          setDuration(0);
          stop();
        } else {
          setDuration(duration + 1);
        }
      }
    }
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [isRunning, duration, beepInterval, beepUrl, setDuration, stop, maxTime]);

  const durationDisplay = formatTime(duration);


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
      </div>
      <StopwatchSettings
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={updateSettings}
        {...{
          beepUrl,
          beepInterval,
          initialDuration: maxTime
        }}
      />
    </div>
  );
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
