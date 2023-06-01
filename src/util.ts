export const formatTime = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const minutesDisplay = minutes < 10 ? `0${minutes}` : minutes;
  const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutesDisplay}:${secondsDisplay}`;
}