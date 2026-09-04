const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validateTask } = require('../middleware/validationMiddleware');

// Route to create a new task (Protected)
router.post('/', protect, validateTask, taskController.createTask);

// Route to get all tasks for the logged-in user (Protected)
router.get('/', protect, taskController.getTasks);

// Route to delete all completed tasks (Protected)
router.delete('/completed', protect, taskController.deleteCompletedTasks);

// Route to get a specific task by ID (Protected)
router.get('/:id', protect, taskController.getTaskById);

// Route to update a specific task by ID (Protected)
router.put('/:id', protect, validateTask, taskController.updateTask);

// Route to toggle a specific task completion by ID (Protected)
router.put('/:id/toggle', protect, taskController.toggleTaskCompletion);

// Route to delete a specific task by ID (Protected)
router.delete('/:id', protect, taskController.deleteTask);

module.exports = router;