import { useState } from 'react';
import { Plus, Trash2, Circle, CheckCircle2 } from 'lucide-react';
import type { Task, Priority, TaskStatus } from '../types';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onSetActive: (id: string) => void;
  onAdd: (title: string, priority: Priority, tag: string) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#6366f1',
};

const TAG_OPTIONS = ['frontend', 'backend', 'testing', 'devops', 'docs', 'other'];

export function TaskList({
  tasks, activeTaskId, onSetActive, onAdd, onUpdateStatus, onDelete,
}: TaskListProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newTag, setNewTag] = useState('frontend');
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAdd(newTitle.trim(), newPriority, newTag);
    setNewTitle('');
    setShowAdd(false);
  };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const cycleStatus = (task: Task) => {
    const next: Record<TaskStatus, TaskStatus> = {
      'todo': 'in-progress',
      'in-progress': 'done',
      'done': 'todo',
    };
    onUpdateStatus(task.id, next[task.status]);
  };

  return (
    <div className="tasklist">
      <div className="tasklist__header">
        <h3 className="tasklist__title">Tasks</h3>
        <button className="add-btn" onClick={() => setShowAdd(s => !s)}>
          <Plus size={15} /> Add
        </button>
      </div>

      {showAdd && (
        <div className="add-form">
          <input
            className="add-input"
            placeholder="Task title..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <div className="add-form__row">
            <select className="mini-select" value={newPriority} onChange={e => setNewPriority(e.target.value as Priority)}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🔵 Low</option>
            </select>
            <select className="mini-select" value={newTag} onChange={e => setNewTag(e.target.value)}>
              {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button className="add-submit" onClick={handleAdd}>Add</button>
          </div>
        </div>
      )}

      <div className="task-filters">
        {(['all', 'todo', 'in-progress', 'done'] as const).map(f => (
          <button
            key={f}
            className={`task-filter ${filter === f ? 'task-filter--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="task-items">
        {filtered.length === 0 && (
          <p className="task-empty">No tasks here — add one above.</p>
        )}
        {filtered.map(task => (
          <div
            key={task.id}
            className={`task-item ${task.status === 'done' ? 'task-item--done' : ''} ${activeTaskId === task.id ? 'task-item--active' : ''}`}
          >
            <button className="task-status-btn" onClick={() => cycleStatus(task)} title="Cycle status">
              {task.status === 'done'
                ? <CheckCircle2 size={18} color="#10b981" />
                : task.status === 'in-progress'
                ? <Circle size={18} color="#f59e0b" />
                : <Circle size={18} color="#555" />}
            </button>
            <div className="task-body" onClick={() => onSetActive(task.id)}>
              <span className="task-title">{task.title}</span>
              <div className="task-meta">
                <span className="task-tag">{task.tag}</span>
                {task.pomodorosSpent > 0 && (
                  <span className="task-pomos">🍅 {task.pomodorosSpent}</span>
                )}
              </div>
            </div>
            <div
              className="priority-dot"
              style={{ background: PRIORITY_COLORS[task.priority] }}
              title={`${task.priority} priority`}
            />
            <button className="task-delete" onClick={() => onDelete(task.id)} title="Delete">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
