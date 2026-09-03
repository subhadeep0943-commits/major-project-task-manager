const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, status } = req.body;
        const task = new Task({
            user: req.user, // Links the task to the authenticated user's ID
            title,
            description,
            dueDate,
            status
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task' });
    }
};

// Fetch all tasks for the logged-in user
exports.getTasks = async (req, res) => {
    try {
        // Find tasks matching the user ID and sort them by newest first
        const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

// Update an existing task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        // Security check: Ensure the user owns this task before modifying it
        if (task.user.toString() !== req.user) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        // Only allow updating specific fields (prevent mass assignment)
        const { title, description, status, dueDate } = req.body;
        const allowedUpdates = {};
        if (title !== undefined) allowedUpdates.title = title;
        if (description !== undefined) allowedUpdates.description = description;
        if (status !== undefined) allowedUpdates.status = status;
        if (dueDate !== undefined) allowedUpdates.dueDate = dueDate;

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            allowedUpdates,
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Security check: Ensure the user owns this task before deleting it
        if (task.user.toString() !== req.user) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
};