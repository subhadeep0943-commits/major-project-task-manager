// ─── api.js — Centralized Axios Instance with Interceptors ───────
// Points to the live Render backend. Automatically attaches JWT
// tokens and intercepts 401 errors to trigger logout.

import axios from 'axios';

// Base URL — live Render backend
const BASE_URL = import.meta.env.VITE_API_URL || 'https://major-project-task-manager.onrender.com/api';

// Create a single Axios instance shared across the entire app
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ──────────────────────────────────────────
// Automatically attach Authorization: Bearer <token> from localStorage
// to every outgoing request so components never manage headers manually.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────
// Intercept 401 Unauthorized responses. If any protected API call
// returns 401, the token is expired/invalid — destroy the session
// and redirect the user back to the landing page.
let logoutHandler = null;

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && logoutHandler) {
      logoutHandler();
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════════
// AUTH API — Registration, Login, Profile
// ═══════════════════════════════════════════════════════════════════

export const authAPI = {
  // Register a new user (Name, unique Email, Password) → returns JWT
  register: (name, email, password) =>
    api.post('/users/register', { name, email, password }),

  // Login an existing user → returns JWT
  login: (email, password) =>
    api.post('/users/login', { email, password }),

  // Fetch current user profile (protected)
  getMe: () =>
    api.get('/users/me'),
};

// ═══════════════════════════════════════════════════════════════════
// TASK API — Full CRUD + Toggle + Bulk Delete
// ═══════════════════════════════════════════════════════════════════

export const taskAPI = {
  // Create a new task with Title, Description, Priority, Due Date, Status
  create: (taskData) =>
    api.post('/tasks', taskData),

  // Fetch all tasks for the authenticated user
  getAll: () =>
    api.get('/tasks'),

  // Fetch a single task by ID
  getById: (id) =>
    api.get(`/tasks/${id}`),

  // Update task fields (Title, Description, Priority, Status, Due Date)
  update: (id, updates) =>
    api.put(`/tasks/${id}`, updates),

  // Toggle completion status (flips completed boolean + updates status)
  toggleCompletion: (id) =>
    api.put(`/tasks/${id}/toggle`),

  // Delete a single task by ID
  delete: (id) =>
    api.delete(`/tasks/${id}`),

  // Bulk delete all completed tasks for the user
  deleteCompleted: () =>
    api.delete('/tasks/completed'),
};

export default api;
