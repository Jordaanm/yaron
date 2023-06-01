import { useState } from 'react';
import './App.css';
import { Competitors } from './Competitors';
import { Stopwatch } from './Stopwatch';
import { TimerProvider } from './contexts/timer-context';

function App() {
  const [duration, setDuration] = useState(0);
  return (
    <>
      <TimerProvider value={{ duration, setDuration }}>
        <Stopwatch />
        <Competitors />
      </TimerProvider>
    </>
  )
}

export default App
