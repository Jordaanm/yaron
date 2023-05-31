import './App.css'
import { Competitors } from './Competitors'
import { Stopwatch } from './Stopwatch'

function App() {
  return (
    <>
      <Stopwatch initialDuration={60} alarmUrl='/beep.wav'/>
      <Competitors />
    </>
  )
}

export default App
