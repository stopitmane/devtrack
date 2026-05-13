# DevTrack

Developer productivity dashboard — Pomodoro timer + task manager with focus stats.

**Live demo:** https://devtrack-app.vercel.app

## Features
- 🍅 **Pomodoro Timer** — 25-min focus sessions with short/long breaks, animated ring
- ✅ **Task Manager** — Add, filter, and track tasks by status and priority
- 📊 **Stats** — Completion rate, total pomodoros, in-progress count
- 🔗 Active task links to timer — pomodoro count auto-increments on completion
- Fully typed with TypeScript

## Tech Stack
- React 18 + TypeScript
- Custom hooks: `usePomodoro` (timer state machine), `useTasks` (task CRUD + stats)
- Lucide icons, Vite build
- Zero external state management — custom hooks only

## Architecture
```
src/
  components/    # PomodoroTimer, TaskList, StatsBar
  hooks/         # usePomodoro, useTasks
  types/         # Task, PomodoroSession, AppState interfaces
```

Built by [Ajayi Taiwo John](https://groovyjwttp-portfolio.vercel.app)
