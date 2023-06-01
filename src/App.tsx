import './App.css'
import { useState, useCallback } from 'react'
import { Competitors } from './Competitors'
import { Stopwatch } from './Stopwatch'
import { TimerProvider } from './contexts/timer-context';

function App() {
  const [duration, setDuration] = useState(0);
  const getDuration = useCallback(() => duration, []);
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
