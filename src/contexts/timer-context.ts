import { createContext } from 'react';

interface TimerContextType {
  duration: number;
  setDuration: (duration: number) => void;
}

export const TimerContext = createContext<TimerContextType>({
  duration: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDuration: () => {}
});

export const TimerProvider = TimerContext.Provider;