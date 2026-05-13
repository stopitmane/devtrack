export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TimerStatus = 'idle' | 'running' | 'break';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
  pomodorosSpent: number;
  tag: string;
}

export interface PomodoroSession {
  id: string;
  taskId: string | null;
  taskTitle: string;
  duration: number; // minutes
  completedAt: Date;
}

export interface DailyStats {
  date: string;
  pomodorosCompleted: number;
  tasksCompleted: number;
  focusMinutes: number;
}

export interface AppState {
  tasks: Task[];
  sessions: PomodoroSession[];
  activeTaskId: string | null;
}
