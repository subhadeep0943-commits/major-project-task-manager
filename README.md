# ⚡ TaskFlow — Smart Task Manager

A full-stack task management application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). TaskFlow helps users organize, track, and manage tasks with a beautiful, modern interface featuring glassmorphism design, real-time statistics, and secure JWT-based authentication.

## 🌐 Live Demo

- **Frontend**: [Live App](https://taskflow-frontend.vercel.app)
- **Backend API**: [API Server](https://taskflow-backend.onrender.com)

## ✨ Features

- 🔐 **Secure Authentication** — Register & login with JWT tokens and bcrypt password hashing
- 📋 **Task Management** — Create, read, update, and delete tasks with title, description, status, and due dates
- 📊 **Real-time Dashboard** — Track task statistics (total, pending, in-progress, completed) at a glance
- 🔄 **Status Cycling** — Click status badges to quickly cycle tasks through pending → in-progress → completed
- 📅 **Due Date Tracking** — Set and view due dates for task deadline management
- 🎨 **Premium Dark UI** — Glassmorphism design with animated gradients, micro-animations, and responsive layout
- 🔔 **Toast Notifications** — Instant feedback for all actions (create, update, delete)
- ⚠️ **Delete Confirmation** — Safety modal to prevent accidental task deletion
- 📱 **Fully Responsive** — Optimized for desktop, tablet, and mobile screens

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 5 | Build tool & dev server |
| Axios | HTTP client for API calls |
| CSS3 | Custom design system with CSS variables |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express 5 | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose 9 | ODM for MongoDB |
| JSON Web Token | Authentication |
| bcrypt | Password hashing |

## 📁 Project Structure

```
taskflow/
├── backend/
│   ├── controllers/
│   │   ├── taskController.js    # Task CRUD logic
│   │   └── userController.js    # Auth (register/login) logic
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification middleware
│   ├── models/
│   │   ├── Task.js              # Mongoose Task schema
│   │   └── User.js              # Mongoose User schema
│   ├── routes/
│   │   ├── taskRoutes.js        # Task API routes
│   │   └── userRoutes.js        # User API routes
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── server.js                # Express app entry point
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── App.jsx              # Main application component
│   │   ├── App.css
│   │   ├── index.css            # Complete design system (1100+ lines)
│   │   └── main.jsx             # React entry point
│   ├── .env.example             # Frontend env template
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (optional for local dev):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:
```bash
npm run dev
```

### 4. Open in Browser
Navigate to `http://localhost:5173` to use the app.

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Health check |
| `POST` | `/api/users/register` | Public | Register new user |
| `POST` | `/api/users/login` | Public | Login user |
| `GET` | `/api/tasks` | Protected | Get all tasks for user |
| `POST` | `/api/tasks` | Protected | Create new task |
| `PUT` | `/api/tasks/:id` | Protected | Update task |
| `DELETE` | `/api/tasks/:id` | Protected | Delete task |

> **Protected** routes require a Bearer token in the `Authorization` header.

## 🧑‍💻 Author

**Subhadeep**

## 📄 License

This project is licensed under the ISC License.
