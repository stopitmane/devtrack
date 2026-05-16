import { useCallback } from 'react';
import { Github, Timer } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskList } from './components/TaskList';
import { StatsBar } from './components/StatsBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

export default function App() {
  const {
    tasks, activeTask, activeTaskId,
    setActiveTaskId, addTask, updateStatus, deleteTask, incrementPomodoro, stats,
  } = useTasks();

  const handlePomodoroComplete = useCallback(() => {
    if (activeTaskId) incrementPomodoro(activeTaskId);
  }, [activeTaskId, incrementPomodoro]);

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <Timer size={20} className="header__icon" />
            <span className="header__title">DevTrack</span>
            <span className="header__sub">Productivity Dashboard</span>
          </div>
          <a
            href="https://github.com/stopitmane"
            target="_blank"
            rel="noopener noreferrer"
            className="header__link"
          >
            <Github size={16} /> GitHub
          </a>
        </div>
      </header>

      <main className="main">
        <StatsBar stats={stats} />

        <div className="layout">
          <aside className="layout__sidebar">
            <PomodoroTimer
              activeTask={activeTask}
              onPomodoroComplete={handlePomodoroComplete}
            />
          </aside>

          <section className="layout__main">
            <TaskList
              tasks={tasks}
              activeTaskId={activeTaskId}
              onSetActive={setActiveTaskId}
              onAdd={addTask}
              onUpdateStatus={updateStatus}
              onDelete={deleteTask}
            />
          </section>
        </div>
      </main>

      <footer className="footer">
        Built by{' '}
        <a href="https://groovyjwttp-portfolio.vercel.app" target="_blank" rel="noopener noreferrer">
          Ajayi Taiwo John
        </a>
      </footer>
    </div>
  );
}
