import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI, taskAPI, setLogoutHandler } from './api';
import './index.css';

// ─── Toast Component ──────────────────────────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={`toast ${type}`}>
      {type === 'success' ? '✓' : '✕'} {message}
    </div>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">⚠️</div>
        <h3>Are you sure?</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────
function EditModal({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'pending');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.substring(0, 10) : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(task._id, { title, description, status, priority, dueDate: dueDate || null });
  };

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal edit-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Task</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              className="form-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-desc">Description</label>
            <input
              id="edit-desc"
              className="form-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-priority">Priority</label>
            <select
              id="edit-priority"
              className="form-input status-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="edit-status">Status</label>
            <select
              id="edit-status"
              className="form-input status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="edit-due">Due Date</label>
            <input
              id="edit-due"
              className="form-input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="edit-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────
function LandingPage({ onGetStarted }) {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="nav-logo-icon">⚡</span>
          TaskFlow
        </div>
        <div className="nav-cta">
          <button className="btn btn-ghost" onClick={() => onGetStarted('login')}>
            Sign In
          </button>
          <button className="btn btn-primary" onClick={() => onGetStarted('register')}>
            Get Started
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Now with smart task tracking
        </div>
        <h1>
          Organize your work,<br />
          <span className="gradient-text">achieve your goals.</span>
        </h1>
        <p className="hero-subtitle">
          TaskFlow helps you manage tasks effortlessly with a beautiful interface.
          Stay on top of deadlines, track progress, and get things done.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => onGetStarted('register')}>
            Start for Free →
          </button>
          <button className="btn btn-secondary" onClick={() => onGetStarted('login')}>
            I have an account
          </button>
        </div>
      </section>

      <section className="features-section">
        <h2>Everything you need</h2>
        <p className="features-subtitle">Powerful features to keep your work organized and flowing.</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon purple">📋</div>
            <h3>Smart Task Management</h3>
            <p>Create, organize, and track tasks with status updates. Move tasks through your workflow seamlessly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is protected with JWT authentication and encrypted passwords. Only you can see your tasks.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue">📊</div>
            <h3>Progress Dashboard</h3>
            <p>Visualize your productivity with real-time stats. See pending, in-progress, and completed tasks at a glance.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Auth Page ────────────────────────────────────────────────────
function AuthPage({ initialMode, onAuth, onBack }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getErrors = () => {
    const errs = {};
    if (!isLogin && name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (email && !emailRegex.test(email)) errs.email = 'Invalid email format';
    if (password && password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const validationErrors = hasSubmitted ? getErrors() : {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    setError('');

    const currentErrors = getErrors();
    if (Object.keys(currentErrors).length > 0) return;

    setLoading(true);

    try {
      const response = isLogin
        ? await authAPI.login(email, password)
        : await authAPI.register(name, email, password);

      const { token, name: userName } = response.data;
      if (token) {
        onAuth(token, userName);
      } else {
        setIsLogin(true);
        setError('');
        setName('');
        setPassword('');
        setHasSubmitted(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setHasSubmitted(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo" onClick={onBack}>⚡ TaskFlow</span>
          <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
          <p>{isLogin ? 'Sign in to manage your tasks' : 'Start organizing your work today'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                className={`form-input ${validationErrors.name ? 'error' : ''}`}
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {validationErrors.name && <div className="field-error">{validationErrors.name}</div>}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              className={`form-input ${validationErrors.email ? 'error' : ''}`}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {validationErrors.email && <div className="field-error">{validationErrors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className={`form-input ${validationErrors.password ? 'error' : ''}`}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {validationErrors.password && <div className="field-error">{validationErrors.password}</div>}
          </div>
          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? <span className="spinner">⟳</span> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={toggleMode}>
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────
function Dashboard({ userName, onLogout, showToast }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Filter & Sort
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState('newest');

  // Fetch all tasks — uses taskAPI (token auto-attached by interceptor)
  const fetchTasks = useCallback(async () => {
    try {
      const response = await taskAPI.getAll();
      setTasks(response.data);
    } catch (error) {
      // 401 is auto-handled by the response interceptor → triggers logout
      if (error.response?.status !== 401) {
        showToast('Failed to load tasks', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create task — maps Title, Description, Priority, Due Date, Status
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const taskData = { title, description, status, priority };
      if (dueDate) taskData.dueDate = dueDate;
      await taskAPI.create(taskData);
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setDueDate('');
      fetchTasks();
      showToast('Task created successfully!', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create task', 'error');
    }
  };

  // Update task — maps payload attributes
  const updateTask = async (taskId, updates) => {
    try {
      await taskAPI.update(taskId, updates);
      fetchTasks();
      showToast('Task updated', 'success');
      setEditTask(null);
    } catch (error) {
      showToast('Failed to update task', 'error');
    }
  };

  // Toggle completion — flips completed boolean + status
  const toggleTaskCompletion = async (taskId) => {
    try {
      await taskAPI.toggleCompletion(taskId);
      fetchTasks();
    } catch (error) {
      showToast('Failed to toggle task', 'error');
    }
  };

  // Cycle status badge (Pending → In Progress → Completed)
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await taskAPI.update(taskId, { status: newStatus });
      fetchTasks();
      showToast(`Task marked as ${newStatus}`, 'success');
    } catch (error) {
      showToast('Failed to update task', 'error');
    }
  };

  // Delete single task
  const deleteTask = async (taskId) => {
    try {
      await taskAPI.delete(taskId);
      fetchTasks();
      showToast('Task deleted', 'success');
    } catch (error) {
      showToast('Failed to delete task', 'error');
    }
  };

  // Bulk delete completed tasks
  const clearCompleted = async () => {
    try {
      await taskAPI.deleteCompleted();
      fetchTasks();
      showToast('Completed tasks cleared', 'success');
      setClearConfirm(false);
    } catch (error) {
      showToast('Failed to clear tasks', 'error');
    }
  };

  const handleDeleteClick = (taskId, taskTitle) => {
    setDeleteConfirm({ id: taskId, title: taskTitle });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteTask(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const statusCycle = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };

  // ─── Real-time Statistics Dashboard ─────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed' || t.completed).length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'completed' && !t.completed).length,
  };

  // ─── Relative time formatter ───────────────────────────────────
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // ─── Advanced Queries: Filter / Search / Sort (client-side) ────
  const displayedTasks = useMemo(() => {
    let result = tasks;

    // Filter by status tab
    if (filterTab !== 'all') {
      if (filterTab === 'completed') {
        result = result.filter(t => t.status === 'completed' || t.completed);
      } else {
        result = result.filter(t => t.status === filterTab && !t.completed);
      }
    }

    // Search by title or description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort by selected mode
    return [...result].sort((a, b) => {
      if (sortMode === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortMode === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortMode === 'priority') {
        const p = { high: 3, medium: 2, low: 1 };
        return (p[b.priority] || 0) - (p[a.priority] || 0);
      }
      if (sortMode === 'due-date') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });
  }, [tasks, filterTab, searchQuery, sortMode]);

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header-left">
          <span className="dash-logo">⚡ TaskFlow</span>
          <span className="dash-greeting">
            Welcome back, <strong>{userName || 'User'}</strong>
          </span>
        </div>
        <div className="dash-header-right">
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="dash-content">
        {/* ── Statistics Dashboard Widget ─────────────────────────── */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-value purple">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-value orange">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value blue">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value green">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value red">{stats.overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>

        {/* ── Add Task Form ──────────────────────────────────────── */}
        <div className="add-task-section">
          <form className="add-task-form" onSubmit={addTask}>
            <div className="form-group">
              <label htmlFor="task-title">Task Title</label>
              <input
                id="task-title"
                className="form-input"
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="task-desc">Description</label>
              <input
                id="task-desc"
                className="form-input"
                type="text"
                placeholder="Optional details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group small">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                className="form-input status-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group small">
              <label htmlFor="task-due">Due Date</label>
              <input
                id="task-due"
                className="form-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              + Add
            </button>
          </form>
        </div>

        {/* ── Toolbar: Filter / Search / Sort ─────────────────────── */}
        <div className="toolbar">
          <div className="filter-tabs">
            {['all', 'pending', 'in-progress', 'completed'].map(tab => (
              <button
                key={tab}
                className={`filter-tab ${filterTab === tab ? 'active' : ''}`}
                onClick={() => setFilterTab(tab)}
              >
                {tab === 'all' ? 'All' : tab === 'in-progress' ? 'In Progress' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <select
            className="sort-select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority (High→Low)</option>
            <option value="due-date">Due Date (Soonest)</option>
          </select>
        </div>

        {/* ── Task List ──────────────────────────────────────────── */}
        <div className="task-list-section">
          <div className="task-list-header">
            <h2>Your Tasks</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="task-count">{displayedTasks.length} task{displayedTasks.length !== 1 ? 's' : ''}</span>
              {stats.completed > 0 && (
                <button className="btn btn-sm btn-clear-completed" onClick={() => setClearConfirm(true)}>
                  Clear Completed
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="skeleton-list">
              {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : displayedTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎯</div>
              <h3>No tasks found</h3>
              <p>{tasks.length === 0 ? 'Create your first task above to get started!' : 'Try adjusting your filters or search query.'}</p>
            </div>
          ) : (
            <div className="task-list">
              {displayedTasks.map((task) => {
                const isCompleted = task.status === 'completed' || task.completed;
                return (
                  <div className={`task-card ${isCompleted ? 'completed-task' : ''}`} key={task._id}>
                    <button
                      className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
                      onClick={() => toggleTaskCompletion(task._id)}
                      aria-label="Toggle completion"
                    >
                      {isCompleted ? '✓' : ''}
                    </button>
                    <div className="task-info">
                      <div className="task-title">{task.title}</div>
                      {task.description && (
                        <div className="task-desc">{task.description}</div>
                      )}
                      <div className="task-meta">
                        {task.priority && (
                          <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                            {task.priority === 'low' ? '🟢' : task.priority === 'medium' ? '🟡' : '🔴'} {task.priority}
                          </span>
                        )}
                        <span>Created {formatDate(task.createdAt)}</span>
                        {task.dueDate && (
                          <span>• Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        )}
                      </div>
                    </div>
                    <div className="task-actions">
                      <button
                        className="btn btn-secondary btn-icon btn-sm"
                        onClick={() => setEditTask(task)}
                        title="Edit task"
                      >
                        ✎
                      </button>
                      <button
                        className={`status-badge ${task.status}`}
                        onClick={() => updateTaskStatus(task._id, statusCycle[task.status])}
                        title={`Click to change to ${statusCycle[task.status]}`}
                      >
                        <span className="status-dot" />
                        {task.status === 'in-progress' ? 'In Progress' : task.status}
                      </button>
                      <button
                        className="btn btn-danger btn-icon btn-sm"
                        onClick={() => handleDeleteClick(task._id, task.title)}
                        title="Delete task"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <ConfirmModal
          message={`This will permanently delete "${deleteConfirm.title}". This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {/* Clear Completed Confirmation Modal */}
      {clearConfirm && (
        <ConfirmModal
          message={`This will permanently delete all completed tasks. This action cannot be undone.`}
          onConfirm={clearCompleted}
          onCancel={() => setClearConfirm(false)}
        />
      )}

      {/* Edit Modal */}
      {editTask && (
        <EditModal
          task={editTask}
          onSave={updateTask}
          onCancel={() => setEditTask(null)}
        />
      )}
    </div>
  );
}

// ─── Main App (Router) ───────────────────────────────────────────
function App() {
  const [page, setPage] = useState(() => {
    return localStorage.getItem('token') ? 'dashboard' : 'landing';
  });
  const [authMode, setAuthMode] = useState('login');
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, key: Date.now() });
  }, []);

  const handleAuth = (newToken, name) => {
    setToken(newToken);
    setUserName(name || '');
    localStorage.setItem('token', newToken);
    if (name) localStorage.setItem('userName', name);
    setPage('dashboard');
  };

  // Logout — destroys token from localStorage (client-side token removal)
  const handleLogout = useCallback(() => {
    setToken('');
    setUserName('');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setPage('landing');
  }, []);

  // Register the logout handler with the Axios interceptor so 401s auto-logout
  useEffect(() => {
    setLogoutHandler(handleLogout);
  }, [handleLogout]);

  const handleGetStarted = (mode) => {
    setAuthMode(mode);
    setPage('auth');
  };

  return (
    <div className="app-wrapper">
      <div className="bg-mesh" />

      {page === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}

      {page === 'auth' && (
        <AuthPage
          initialMode={authMode}
          onAuth={handleAuth}
          onBack={() => setPage('landing')}
        />
      )}

      {page === 'dashboard' && (
        <Dashboard
          userName={userName}
          onLogout={handleLogout}
          showToast={showToast}
        />
      )}

      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;