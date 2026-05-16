import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../hooks/useTasks';

describe('useTasks', () => {
  it('initialises with default tasks', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks.length).toBeGreaterThan(0);
  });

  it('adds a new task to the front of the list', () => {
    const { result } = renderHook(() => useTasks());
    const before = result.current.tasks.length;

    act(() => {
      result.current.addTask('Write tests', 'high', 'testing');
    });

    expect(result.current.tasks.length).toBe(before + 1);
    expect(result.current.tasks[0].title).toBe('Write tests');
    expect(result.current.tasks[0].status).toBe('todo');
    expect(result.current.tasks[0].pomodorosSpent).toBe(0);
  });

  it('adds a task with correct priority and tag', () => {
    const { result } = renderHook(() => useTasks());
    act(() => result.current.addTask('Deploy API', 'medium', 'devops'));
    const task = result.current.tasks[0];
    expect(task.priority).toBe('medium');
    expect(task.tag).toBe('devops');
  });

  it('updates task status to done and sets completedAt', () => {
    const { result } = renderHook(() => useTasks());
    act(() => result.current.addTask('Fix bug', 'high', 'frontend'));
    const id = result.current.tasks[0].id;

    act(() => result.current.updateStatus(id, 'done'));

    const updated = result.current.tasks.find(t => t.id === id);
    expect(updated?.status).toBe('done');
    expect(updated?.completedAt).toBeDefined();
  });

  it('clears completedAt when status moves away from done', () => {
    const { result } = renderHook(() => useTasks());
    act(() => result.current.addTask('Fix bug', 'high', 'frontend'));
    const id = result.current.tasks[0].id;

    act(() => result.current.updateStatus(id, 'done'));
    act(() => result.current.updateStatus(id, 'in-progress'));

    const task = result.current.tasks.find(t => t.id === id);
    expect(task?.completedAt).toBeUndefined();
  });

  it('deletes a task by id', () => {
    const { result } = renderHook(() => useTasks());
    act(() => result.current.addTask('Delete me', 'low', 'docs'));
    const id = result.current.tasks[0].id;

    act(() => result.current.deleteTask(id));

    expect(result.current.tasks.find(t => t.id === id)).toBeUndefined();
  });

  it('clears activeTaskId when the active task is deleted', () => {
    const { result } = renderHook(() => useTasks());
    act(() => result.current.addTask('Active task', 'high', 'frontend'));
    const id = result.current.tasks[0].id;

    act(() => result.current.setActiveTaskId(id));
    expect(result.current.activeTaskId).toBe(id);

    act(() => result.current.deleteTask(id));
    expect(result.current.activeTaskId).toBeNull();
  });

  it('increments pomodorosSpent for a task', () => {
    const { result } = renderHook(() => useTasks());
    act(() => result.current.addTask('Focus task', 'high', 'frontend'));
    const id = result.current.tasks[0].id;

    act(() => result.current.incrementPomodoro(id));
    act(() => result.current.incrementPomodoro(id));

    const task = result.current.tasks.find(t => t.id === id);
    expect(task?.pomodorosSpent).toBe(2);
  });

  it('computes stats correctly', () => {
    const { result } = renderHook(() => useTasks());

    // Clear initial tasks and start fresh
    act(() => {
      result.current.tasks.forEach(t => result.current.deleteTask(t.id));
    });

    act(() => result.current.addTask('Task A', 'high', 'frontend'));
    act(() => result.current.addTask('Task B', 'medium', 'backend'));
    act(() => result.current.addTask('Task C', 'low', 'docs'));

    const idA = result.current.tasks.find(t => t.title === 'Task A')!.id;
    const idB = result.current.tasks.find(t => t.title === 'Task B')!.id;

    act(() => result.current.updateStatus(idA, 'done'));
    act(() => result.current.updateStatus(idB, 'in-progress'));

    const { stats } = result.current;
    expect(stats.total).toBe(3);
    expect(stats.done).toBe(1);
    expect(stats.inProgress).toBe(1);
  });

  it('activeTask returns the task matching activeTaskId', () => {
    const { result } = renderHook(() => useTasks());
    act(() => result.current.addTask('My active', 'high', 'frontend'));
    const id = result.current.tasks[0].id;

    act(() => result.current.setActiveTaskId(id));
    expect(result.current.activeTask?.title).toBe('My active');
  });

  it('activeTask returns null when no activeTaskId set', () => {
    const { result } = renderHook(() => useTasks());
    act(() => result.current.setActiveTaskId(null));
    expect(result.current.activeTask).toBeNull();
  });
});
