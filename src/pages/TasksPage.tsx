import React, { useState, useEffect } from 'react';
import './TasksPage.css';

interface Task {
  id: string;
  dateStr: string;
  text: string;
  completed: boolean;
}

function getISTDateStr(date = new Date()) {
  const d = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateDisplay(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('flowstate_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse tasks', e);
      }
    }
    return [];
  });
  const [newTaskText, setNewTaskText] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const todayStr = getISTDateStr();

  // Time left calculation
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0); // 00:00:00 next day
      const diff = tomorrow.getTime() - now.getTime();
      
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${h}h ${m}min`);
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    localStorage.setItem('flowstate_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      dateStr: todayStr,
      text: newTaskText.trim(),
      completed: false
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Reordering logic
  const todayTasks = tasks.filter(t => t.dateStr === todayStr);
  
  const onDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIdx(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    
    // We need to reorder todayTasks, and then update the main tasks array
    const newTodayTasks = [...todayTasks];
    const draggedItem = newTodayTasks[draggedIdx];
    
    newTodayTasks.splice(draggedIdx, 1);
    newTodayTasks.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    
    // Update main array by replacing today's tasks
    const otherTasks = tasks.filter(t => t.dateStr !== todayStr);
    setTasks([...otherTasks, ...newTodayTasks]);
  };

  const onDragEnd = () => {
    setDraggedIdx(null);
  };

  // Group tasks by date for past tasks
  const pastTasks = tasks.filter(t => t.dateStr !== todayStr);
  const groupedPast = pastTasks.reduce((acc, task) => {
    if (!acc[task.dateStr]) acc[task.dateStr] = [];
    acc[task.dateStr].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const pastDates = Object.keys(groupedPast).sort((a, b) => b.localeCompare(a));

  return (
    <div className="tasks-page hide-scrollbar">
      <header className="tasks-header">
        <h1>Task List</h1>
        <div className="date-indicator">Today: {formatDateDisplay(todayStr)}</div>
      </header>

      <div className="tasks-content hide-scrollbar">
        <section className="today-section">
          <div className="today-header-flex">
            <h2>Today's Tasks</h2>
            <div className="time-left-badge">Complete in {timeLeft}</div>
          </div>
          
          <form className="add-task-form" onSubmit={addTask}>
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
            />
            <button type="submit" className="btn-add">Add Task</button>
          </form>

          <div className="task-list single-list hide-scrollbar">
            {todayTasks.length === 0 ? (
              <div className="empty-state">No tasks for today. Enjoy your flow!</div>
            ) : (
              todayTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className={`task-item ${task.completed ? 'completed' : ''} ${draggedIdx === index ? 'dragging' : ''}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                >
                  <div className="drag-handle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                  </div>
                  
                  <div className="task-number">{index + 1}</div>

                  <label className="task-checkbox">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleTask(task.id)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <div className="task-text">{task.text}</div>
                  <div className="task-actions">
                    <button className="btn-delete" onClick={() => deleteTask(task.id)} aria-label="Delete">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {pastDates.length > 0 && (
          <section className="past-section hide-scrollbar">
            <h2>Past Tasks</h2>
            <div className="past-days-list">
              {pastDates.map(dateStr => {
                const dayTasks = groupedPast[dateStr];
                const completedCount = dayTasks.filter(t => t.completed).length;
                const totalCount = dayTasks.length;
                const percent = Math.round((completedCount / totalCount) * 100);
                const isSuccess = percent >= 50;

                return (
                  <div key={dateStr} className="past-day-card">
                    <div className="past-day-header">
                      <h3>{formatDateDisplay(dateStr)}</h3>
                      <div className={`completion-badge ${isSuccess ? 'success' : 'fail'}`}>
                        {percent}% Completed
                      </div>
                    </div>
                    <div className="past-task-list">
                      {dayTasks.map(task => (
                        <div key={task.id} className={`past-task-item ${task.completed ? 'completed' : ''}`}>
                          <div className={`past-checkbox ${task.completed ? 'checked' : ''}`}>
                            {task.completed && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                          </div>
                          <div className="past-task-text">{task.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
