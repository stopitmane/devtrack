# DevTrack

Developer productivity dashboard — Pomodoro timer + task manager with focus stats.

**Live demo:** https://devtrack-app.vercel.app

## Features
- 🍅 **Pomodoro Timer** — 25-min focus sessions with short/long breaks, animated ring
- ✅ **Task Manager** — Add, filter, and track tasks by status and priority
- 📊 **Stats** — Completion rate, total pomodoros, in-progress count
- 🔗 Active task links to timer — pomodoro count auto-increments on completion
- 🛡️ **Error Boundary** — Graceful error handling with recovery
- ✅ **Unit Tests** — Comprehensive test coverage for hooks
- Fully typed with TypeScript

## Tech Stack
- React 18 + TypeScript
- Custom hooks: `usePomodoro` (timer state machine), `useTasks` (task CRUD + stats)
- Lucide icons, Vite build
- Vitest + React Testing Library
- Zero external state management — custom hooks only

## Architecture
```
src/
  components/    # PomodoroTimer, TaskList, StatsBar, ErrorBoundary
  hooks/         # usePomodoro, useTasks
  types/         # Task, PomodoroSession, AppState interfaces
  test/          # Unit tests for hooks
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## What This Project Demonstrates
- Complex frontend state management without external libraries
- Custom React hooks with TypeScript
- Pomodoro timer state machine implementation
- Task management with CRUD operations
- Real-time stats calculation
- Error boundary implementation
- Unit testing with Vitest

Built by [Ajayi Taiwo John](https://groovyjwttp-portfolio.vercel.app)
