import { useState, useCallback } from 'react';
import type { Task, Priority, TaskStatus } from '../types';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Set up Django REST API project', priority: 'high', status: 'done', createdAt: new Date(), completedAt: new Date(), pomodorosSpent: 2, tag: 'backend' },
  { id: '2', title: 'Build product listing page in React', priority: 'high', status: 'in-progress', createdAt: new Date(), pomodorosSpent: 1, tag: 'frontend' },
  { id: '3', title: 'Write unit tests for cart service', priority: 'medium', status: 'todo', createdAt: new Date(), pomodorosSpent: 0, tag: 'testing' },
  { id: '4', title: 'Configure Nginx and Gunicorn', priority: 'medium', status: 'todo', createdAt: new Date(), pomodorosSpent: 0, tag: 'devops' },
  { id: '5', title: 'Update portfolio README', priority: 'low', status: 'todo', createdAt: new Date(), pomodorosSpent: 0, tag: 'docs' },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTaskId, setActiveTaskId] = useState<string | null>('2');

  const addTask = useCallback((title: string, priority: Priority, tag: string) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      priority,
      status: 'todo',
      createdAt: new Date(),
      pomodorosSpent: 0,
      tag,
    };
    setTasks(prev => [task, ...prev]);
  }, []);

  const updateStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, status, completedAt: status === 'done' ? new Date() : undefined }
        : t
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setActiveTaskId(prev => prev === id ? null : prev);
  }, []);

  const incrementPomodoro = useCallback((id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, pomodorosSpent: t.pomodorosSpent + 1 } : t
    ));
  }, []);

  const activeTask = tasks.find(t => t.id === activeTaskId) ?? null;

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    totalPomodoros: tasks.reduce((s, t) => s + t.pomodorosSpent, 0),
  };

  return {
    tasks, activeTask, activeTaskId,
    setActiveTaskId, addTask, updateStatus, deleteTask, incrementPomodoro, stats,
  };
}
