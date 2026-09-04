# ⚡ TaskFlow — Smart Task Manager

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) task management application with a premium dark-mode UI, JWT authentication, real-time statistics, and advanced filtering capabilities.

---

## 📸 Features

### 🏠 Landing Page
- Modern hero section with animated gradient backgrounds
- Feature showcase cards with glassmorphism design

### 🔐 Authentication
- Secure user registration and login with JWT tokens
- Passwords hashed with bcrypt (10 salt rounds)
- Client-side form validation with inline error messages
- Auto-login after registration
- Protected API routes with Bearer token middleware

### 📋 Task Management
- **Create** tasks with title, description, priority (Low/Medium/High), status, and due date
- **Edit** tasks via modal dialog
- **Delete** tasks with confirmation dialog
- **Toggle completion** with single-click checkbox
- **Cycle status** by clicking status badges (Pending → In Progress → Completed)
- **Bulk delete** all completed tasks with one click

### 📊 Dashboard & Statistics
- Real-time stats: Total | Pending | In Progress | Completed | Overdue
- Priority indicators (color-coded badges)
- Relative timestamps ("5m ago", "2h ago")
- Loading skeleton animations

### 🔍 Filter, Search & Sort
- **Filter tabs**: All | Pending | In Progress | Completed
- **Search bar**: Real-time search by title or description
- **Sort controls**: Newest | Oldest | Priority | Due Date

### 🎨 Premium UI
- Dark-mode glassmorphism design system
- Animated mesh background blobs
- Inter font family with proper weight hierarchy
- Smooth micro-animations (fadeIn, slideIn, shake, pulse)
- Toast notifications for all user actions
- Fully responsive (mobile, tablet, desktop)

---

## 🛠️ Tech Stack

| Layer      | Technology                    |
| ---------- | ----------------------------- |
| Frontend   | React.js 19, Vite 5          |
| Backend    | Node.js, Express.js 5        |
| Database   | MongoDB Atlas (Mongoose 9)    |
| Auth       | JWT (jsonwebtoken), bcrypt    |
| HTTP       | Axios                         |
| Styling    | Custom CSS (Glassmorphism)    |
| Dev Tools  | Nodemon, Vite HMR             |

---

## 📁 Project Structure

```
major-project-task-manager/
├── backend/
│   ├── controllers/
│   │   ├── taskController.js    # Task CRUD + toggle + bulk delete
│   │   └── userController.js    # Register, Login, GetMe
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT token verification
│   │   ├── errorMiddleware.js   # asyncHandler, 404, error handler
│   │   └── validationMiddleware.js  # Input validation
│   ├── models/
│   │   ├── Task.js              # Task schema (title, desc, priority, status, completed, dueDate)
│   │   └── User.js              # User schema (name, email, password)
│   ├── routes/
│   │   ├── taskRoutes.js        # Task API routes
│   │   └── userRoutes.js        # User API routes
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main React application (all components)
│   │   ├── App.css              # Component-level styles
│   │   ├── index.css            # Design system & global styles
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML template with Google Fonts
│   ├── package.json
│   └── vite.config.js           # Vite configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20.x or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/major-project-task-manager.git
cd major-project-task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
```

Start the backend server:
```bash
npm run dev      # Development (with hot reload via Nodemon)
npm start        # Production
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Optionally create `.env` in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:
```bash
npm run dev
```

### 4. Open the App
Navigate to `http://localhost:5173` in your browser.

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Auth     | Body                        | Response                     |
| ------ | -------------------- | -------- | --------------------------- | ---------------------------- |
| POST   | `/api/users/register`| No       | `{ name, email, password }` | `{ token, userId, name }`    |
| POST   | `/api/users/login`   | No       | `{ email, password }`       | `{ token, userId, name }`    |
| GET    | `/api/users/me`      | Bearer   | —                           | `{ _id, name, email, createdAt }` |

### Task Endpoints (All Protected)

| Method | Endpoint                | Body                                              | Response            |
| ------ | ----------------------- | ------------------------------------------------- | ------------------- |
| POST   | `/api/tasks`            | `{ title, description?, priority?, status?, dueDate? }` | Task object    |
| GET    | `/api/tasks`            | —                                                 | Array of tasks      |
| GET    | `/api/tasks/:id`        | —                                                 | Single task         |
| PUT    | `/api/tasks/:id`        | `{ title?, description?, priority?, status?, dueDate? }` | Updated task   |
| PUT    | `/api/tasks/:id/toggle` | —                                                 | Toggled task        |
| DELETE | `/api/tasks/:id`        | —                                                 | `{ message }`       |
| DELETE | `/api/tasks/completed`  | —                                                 | `{ message, deletedCount }` |

### Task Model Fields

| Field         | Type     | Values                           | Default    |
| ------------- | -------- | -------------------------------- | ---------- |
| `title`       | String   | 1–100 characters                 | (required) |
| `description` | String   | Optional                         | —          |
| `status`      | String   | `pending`, `in-progress`, `completed` | `pending` |
| `priority`    | String   | `low`, `medium`, `high`          | `medium`   |
| `completed`   | Boolean  | `true` / `false`                 | `false`    |
| `dueDate`     | Date     | Optional                         | —          |

---

## 🌐 Deployment

### Frontend — Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repository
4. Set the **Root Directory** to `frontend`
5. Set **Build Command**: `npm run build`
6. Set **Output Directory**: `dist`
7. Add environment variable: `VITE_API_URL` = your deployed backend URL (e.g., `https://your-backend.onrender.com/api`)
8. Deploy

### Frontend — Netlify (Alternative)

1. Go to [netlify.com](https://netlify.com) → New site from Git
2. Connect your GitHub repository
3. Set **Base directory**: `frontend`
4. Set **Build command**: `npm run build`
5. Set **Publish directory**: `frontend/dist`
6. Add environment variable: `VITE_API_URL`
7. Add a `frontend/public/_redirects` file with: `/* /index.html 200`
8. Deploy

### Backend — Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repository
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add environment variables:
   - `PORT` = `5000` (or Render's default)
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret key
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = your Vercel/Netlify frontend URL
7. Deploy

### Backend — Railway (Alternative)

1. Go to [railway.app](https://railway.app) → New Project
2. Deploy from GitHub
3. Set **Root Directory**: `backend`
4. Add environment variables (same as Render above)
5. Railway auto-detects Node.js and runs `npm start`
6. Deploy

> **Important:** After deploying the backend, update CORS in `server.js` to include your production frontend URL in the `allowedOrigins` array.

---

## 🔒 Environment Variables Reference

### Backend (`.env`)
| Variable      | Description                              | Example                                    |
| ------------- | ---------------------------------------- | ------------------------------------------ |
| `PORT`        | Server port                              | `5000`                                     |
| `MONGO_URI`   | MongoDB Atlas connection string          | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET`  | Secret key for JWT signing               | `my_super_secret_key_123`                  |
| `NODE_ENV`    | Environment (development/production)     | `production`                               |
| `CLIENT_URL`  | Frontend URL for CORS                    | `https://taskflow.vercel.app`              |

### Frontend (`.env`)
| Variable        | Description           | Example                                  |
| --------------- | --------------------- | ---------------------------------------- |
| `VITE_API_URL`  | Backend API base URL  | `https://your-backend.onrender.com/api`  |

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Subhadeep** — Built as a Major Project for Task Management.
