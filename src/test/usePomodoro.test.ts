import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePomodoro } from '../hooks/usePomodoro';

describe('usePomodoro', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('initialises with 25-minute work session in idle state', () => {
    const { result } = renderHook(() => usePomodoro());
    expect(result.current.timeLeft).toBe(25 * 60);
    expect(result.current.status).toBe('idle');
    expect(result.current.isWork).toBe(true);
    expect(result.current.round).toBe(1);
  });

  it('starts the timer when start() is called', () => {
    const { result } = renderHook(() => usePomodoro());
    act(() => result.current.start());
    expect(result.current.status).toBe('running');
  });

  it('pauses the timer when pause() is called', () => {
    const { result } = renderHook(() => usePomodoro());
    act(() => result.current.start());
    act(() => result.current.pause());
    expect(result.current.status).toBe('idle');
  });

  it('counts down time when running', () => {
    const { result } = renderHook(() => usePomodoro());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.timeLeft).toBe(25 * 60 - 5);
  });

  it('does not count down when paused', () => {
    const { result } = renderHook(() => usePomodoro());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(3000));
    act(() => result.current.pause());
    const timeAtPause = result.current.timeLeft;
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.timeLeft).toBe(timeAtPause);
  });

  it('resets to initial state when reset() is called', () => {
    const { result } = renderHook(() => usePomodoro());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(10000));
    act(() => result.current.reset());

    expect(result.current.timeLeft).toBe(25 * 60);
    expect(result.current.status).toBe('idle');
    expect(result.current.isWork).toBe(true);
    expect(result.current.round).toBe(1);
  });

  it('skip() switches from work phase to break phase', () => {
    const { result } = renderHook(() => usePomodoro());
    expect(result.current.isWork).toBe(true);
    act(() => result.current.skip());
    expect(result.current.isWork).toBe(false);
  });

  it('skip() switches from break phase back to work phase', () => {
    const { result } = renderHook(() => usePomodoro());
    act(() => result.current.skip()); // work → break
    act(() => result.current.skip()); // break → work
    expect(result.current.isWork).toBe(true);
  });

  it('fires onComplete callback when a work session finishes', () => {
    const { result } = renderHook(() => usePomodoro());
    const onComplete = vi.fn();
    act(() => result.current.onComplete(onComplete));
    act(() => result.current.start());

    // Advance full 25 minutes
    act(() => vi.advanceTimersByTime(25 * 60 * 1000));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('does NOT fire onComplete callback for break sessions', () => {
    const { result } = renderHook(() => usePomodoro());
    const onComplete = vi.fn();
    act(() => result.current.onComplete(onComplete));
    act(() => result.current.skip()); // enter break
    act(() => result.current.start());

    act(() => vi.advanceTimersByTime(5 * 60 * 1000)); // full break

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('sets status to break after work session completes', () => {
    const { result } = renderHook(() => usePomodoro());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(25 * 60 * 1000));
    expect(result.current.status).toBe('break');
  });
});
