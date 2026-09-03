import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await axios.post(`${API}/users/${endpoint}`, payload);
      const { token, name: userName } = response.data;
      if (token) {
        onAuth(token, userName);
      } else {
        // Fallback: registration didn't return token, switch to login
        setIsLogin(true);
        setError('');
        setName('');
        setPassword('');
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

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                className="form-input"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? '...' : isLogin ? 'Sign In' : 'Create Account'}
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
function Dashboard({ token, userName, onLogout, showToast }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const authHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/tasks`, authHeaders());
      setTasks(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [authHeaders, onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const taskData = { title, description, status };
      if (dueDate) taskData.dueDate = dueDate;
      await axios.post(`${API}/tasks`, taskData, authHeaders());
      setTitle('');
      setDescription('');
      setStatus('pending');
      setDueDate('');
      fetchTasks();
      showToast('Task created successfully!', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create task', 'error');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`${API}/tasks/${taskId}`, { status: newStatus }, authHeaders());
      fetchTasks();
      showToast(`Task marked as ${newStatus}`, 'success');
    } catch (error) {
      showToast('Failed to update task', 'error');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API}/tasks/${taskId}`, authHeaders());
      fetchTasks();
      showToast('Task deleted', 'success');
    } catch (error) {
      showToast('Failed to delete task', 'error');
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

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

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
        {/* Stats */}
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
        </div>

        {/* Add Task */}
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
              <label htmlFor="task-due">Due Date</label>
              <input
                id="task-due"
                className="form-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="form-group small">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                className="form-input status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              + Add
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="task-list-section">
          <div className="task-list-header">
            <h2>Your Tasks</h2>
            <span className="task-count">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="empty-state-icon">⏳</div>
              <h3>Loading tasks...</h3>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎯</div>
              <h3>No tasks yet</h3>
              <p>Create your first task above to get started!</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div className="task-card" key={task._id}>
                  <div className="task-info">
                    <div className="task-title">{task.title}</div>
                    {task.description && (
                      <div className="task-desc">{task.description}</div>
                    )}
                    <div className="task-meta">
                      <span>Created {formatDate(task.createdAt)}</span>
                      {task.dueDate && (
                        <span>• Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      )}
                    </div>
                  </div>
                  <div className="task-actions">
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
              ))}
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

  const handleLogout = useCallback(() => {
    setToken('');
    setUserName('');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setPage('landing');
  }, []);

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
          token={token}
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