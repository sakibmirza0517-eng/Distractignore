import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Edit2, 
  Trash2, 
  Calendar,
  Filter
} from 'lucide-react';
import { TaskItem } from '../types';
import { Card3D } from './Card3D';

interface TasksViewProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onOpenAddTask: () => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onOpenAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0f1426] border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Daily Focus Tasks</h1>
          </div>
          <p className="text-xs text-slate-400">
            {completedCount} of {tasks.length} tasks completed today. Organize your study goals step by step.
          </p>
        </div>

        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer border ${
              filter === f
                ? 'bg-blue-600 text-white border-blue-500 shadow'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
            }`}
          >
            {f} ({f === 'all' ? tasks.length : f === 'active' ? tasks.length - completedCount : completedCount})
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0f1426] border border-white/5 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No tasks in this view</p>
            <p className="text-xs text-slate-400">Click "New Task" above to add your study goals.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <Card3D key={task.id} intensity={2}>
              <div className="p-4 rounded-xl bg-[#0f1426] border border-white/5 hover:border-white/15 transition flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="cursor-pointer text-slate-400 hover:text-blue-400 transition shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 fill-indigo-500/20" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-600 hover:border-blue-400 transition" />
                    )}
                  </button>

                  <div className="overflow-hidden space-y-0.5">
                    <p
                      className={`text-sm font-medium truncate ${
                        task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{task.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onEditTask(task)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                    title="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card3D>
          ))
        )}
      </div>
    </div>
  );
};
