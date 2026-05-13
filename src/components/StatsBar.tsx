import { CheckSquare, Clock, Zap, Target } from 'lucide-react';

interface StatsBarProps {
  stats: {
    total: number;
    done: number;
    inProgress: number;
    totalPomodoros: number;
  };
}

export function StatsBar({ stats }: StatsBarProps) {
  const completionRate = stats.total > 0
    ? Math.round((stats.done / stats.total) * 100)
    : 0;

  return (
    <div className="statsbar">
      <div className="stat-card">
        <div className="stat-card__icon stat-card__icon--green">
          <CheckSquare size={16} />
        </div>
        <div className="stat-card__body">
          <span className="stat-card__value">{stats.done}/{stats.total}</span>
          <span className="stat-card__label">Tasks done</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card__icon stat-card__icon--amber">
          <Zap size={16} />
        </div>
        <div className="stat-card__body">
          <span className="stat-card__value">{stats.inProgress}</span>
          <span className="stat-card__label">In progress</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card__icon stat-card__icon--red">
          <Clock size={16} />
        </div>
        <div className="stat-card__body">
          <span className="stat-card__value">{stats.totalPomodoros}</span>
          <span className="stat-card__label">🍅 Pomodoros</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card__icon stat-card__icon--purple">
          <Target size={16} />
        </div>
        <div className="stat-card__body">
          <span className="stat-card__value">{completionRate}%</span>
          <span className="stat-card__label">Completion</span>
        </div>
        <div className="stat-bar-wrap">
          <div className="stat-bar" style={{ width: `${completionRate}%` }} />
        </div>
      </div>
    </div>
  );
}
