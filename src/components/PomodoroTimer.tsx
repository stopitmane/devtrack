import { useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { usePomodoro } from '../hooks/usePomodoro';
import type { Task } from '../types';

interface PomodoroTimerProps {
  activeTask: Task | null;
  onPomodoroComplete: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const WORK_TOTAL = 25 * 60;

export function PomodoroTimer({ activeTask, onPomodoroComplete }: PomodoroTimerProps) {
  const { timeLeft, status, round, isWork, start, pause, reset, skip, onComplete } = usePomodoro();

  useEffect(() => {
    onComplete(onPomodoroComplete);
  }, [onComplete, onPomodoroComplete]);

  const progress = isWork
    ? ((WORK_TOTAL - timeLeft) / WORK_TOTAL) * 100
    : 100 - (timeLeft / (5 * 60)) * 100;

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`pomodoro ${isWork ? 'pomodoro--work' : 'pomodoro--break'}`}>
      <div className="pomodoro__phase">
        {isWork ? '🍅 Focus' : '☕ Break'} · Round {round}
      </div>

      <div className="pomodoro__ring-wrap">
        <svg className="pomodoro__ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" className="ring-track" />
          <circle
            cx="60" cy="60" r="54"
            className="ring-progress"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="pomodoro__time">{formatTime(timeLeft)}</div>
      </div>

      {activeTask && (
        <div className="pomodoro__task">
          Working on: <strong>{activeTask.title}</strong>
        </div>
      )}

      <div className="pomodoro__controls">
        <button className="pomo-btn pomo-btn--ghost" onClick={reset} title="Reset">
          <RotateCcw size={16} />
        </button>
        <button className="pomo-btn pomo-btn--primary" onClick={status === 'running' ? pause : start}>
          {status === 'running' ? <Pause size={20} /> : <Play size={20} />}
          {status === 'running' ? 'Pause' : 'Start'}
        </button>
        <button className="pomo-btn pomo-btn--ghost" onClick={skip} title="Skip">
          <SkipForward size={16} />
        </button>
      </div>

      <div className="pomodoro__dots">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`pomo-dot ${i < (round - 1) % 4 ? 'pomo-dot--done' : ''}`} />
        ))}
      </div>
    </div>
  );
}
