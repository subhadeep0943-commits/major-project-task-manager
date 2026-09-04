const Task = require('../models/Task');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Create a new task
exports.createTask = asyncHandler(async (req, res) => {
    const { title, description, dueDate, status, priority } = req.body;
    const task = new Task({
        user: req.user, // Links the task to the authenticated user's ID
        title,
        description,
        dueDate,
        status,
        priority
    });
    await task.save();
    res.status(201).json(task);
});

// Fetch all tasks for the logged-in user
exports.getTasks = asyncHandler(async (req, res) => {
    // Find tasks matching the user ID and sort them by newest first
    const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
});

// Fetch single task by ID
exports.getTaskById = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }
    
    // Security check: Ensure the user owns this task
    if (task.user.toString() !== req.user) {
        res.status(403);
        throw new Error('Not authorized to access this task');
    }
    
    res.status(200).json(task);
});

// Update an existing task
exports.updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }
    
    // Security check: Ensure the user owns this task before modifying it
    if (task.user.toString() !== req.user) {
        res.status(403);
        throw new Error('Not authorized to update this task');
    }

    // Only allow updating specific fields (prevent mass assignment)
    const { title, description, status, dueDate, priority } = req.body;
    const allowedUpdates = {};
    if (title !== undefined) allowedUpdates.title = title;
    if (description !== undefined) allowedUpdates.description = description;
    if (status !== undefined) allowedUpdates.status = status;
    if (dueDate !== undefined) allowedUpdates.dueDate = dueDate;
    if (priority !== undefined) allowedUpdates.priority = priority;

    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        allowedUpdates,
        { new: true, runValidators: true }
    );
    res.status(200).json(updatedTask);
});

// Toggle task completion status
exports.toggleTaskCompletion = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }
    
    // Security check: Ensure the user owns this task before modifying it
    if (task.user.toString() !== req.user) {
        res.status(403);
        throw new Error('Not authorized to update this task');
    }

    task.completed = !task.completed;
    task.status = task.completed ? 'completed' : 'pending';
    
    await task.save();
    res.status(200).json(task);
});

// Delete all completed tasks
exports.deleteCompletedTasks = asyncHandler(async (req, res) => {
    const result = await Task.deleteMany({ user: req.user, completed: true });
    res.status(200).json({ message: `${result.deletedCount} tasks removed successfully` });
});

// Delete a task
exports.deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Security check: Ensure the user owns this task before deleting it
    if (task.user.toString() !== req.user) {
        res.status(403);
        throw new Error('Not authorized to delete this task');
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task removed successfully' });
});