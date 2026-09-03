const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Route to create a new task (Protected)
router.post('/', protect, taskController.createTask);

// Route to get all tasks for the logged-in user (Protected)
router.get('/', protect, taskController.getTasks);

// Route to update a specific task by ID (Protected)
router.put('/:id', protect, taskController.updateTask);

// Route to delete a specific task by ID (Protected)
router.delete('/:id', protect, taskController.deleteTask);

module.exports = router;