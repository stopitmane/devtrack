import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerStatus } from '../types';

const WORK_MINUTES = 25;
const SHORT_BREAK = 5;
const LONG_BREAK = 15;

interface UsePomodoroReturn {
  timeLeft: number;       // seconds
  status: TimerStatus;
  round: number;
  isWork: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  onComplete: (cb: () => void) => void;
}

export function usePomodoro(): UsePomodoroReturn {
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [round, setRound] = useState(1);
  const [isWork, setIsWork] = useState(true);
  const [timeLeft, setTimeLeft] = useState(WORK_MINUTES * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const getBreakDuration = (r: number) =>
    r % 4 === 0 ? LONG_BREAK : SHORT_BREAK;

  useEffect(() => {
    if (status !== 'running') return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          // Notify completion
          if (isWork) onCompleteRef.current?.();
          // Switch phase
          setIsWork(w => {
            const nextIsWork = !w;
            const nextRound = !w ? round : round + 1;
            if (!w) setRound(nextRound);
            const duration = nextIsWork
              ? WORK_MINUTES
              : getBreakDuration(nextRound);
            setStatus('break');
            setTimeout(() => setTimeLeft(duration * 60), 0);
            return nextIsWork;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [status, isWork, round]);

  const start = useCallback(() => setStatus('running'), []);
  const pause = useCallback(() => setStatus('idle'), []);

  const reset = useCallback(() => {
    clearTimer();
    setStatus('idle');
    setIsWork(true);
    setRound(1);
    setTimeLeft(WORK_MINUTES * 60);
  }, []);

  const skip = useCallback(() => {
    clearTimer();
    setIsWork(w => {
      const nextIsWork = !w;
      const nextRound = !w ? round : round + 1;
      if (!w) setRound(nextRound);
      const duration = nextIsWork ? WORK_MINUTES : getBreakDuration(nextRound);
      setTimeLeft(duration * 60);
      setStatus('idle');
      return nextIsWork;
    });
  }, [round]);

  const onComplete = useCallback((cb: () => void) => {
    onCompleteRef.current = cb;
  }, []);

  return { timeLeft, status, round, isWork, start, pause, reset, skip, onComplete };
}
