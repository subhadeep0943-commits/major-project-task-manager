const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];

    if (!name || name.length < 2 || name.length > 50) {
        errors.push('Name must be between 2 and 50 characters');
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Please provide a valid email');
    }
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Please provide a valid email');
    }
    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    next();
};

const validateTask = (req, res, next) => {
    const { title, status, priority, dueDate } = req.body;
    const errors = [];

    if (req.method === 'POST') {
        if (!title || title.length < 1 || title.length > 100) {
            errors.push('Title must be between 1 and 100 characters');
        }
    } else if (req.method === 'PUT' && title !== undefined) {
        if (title.length < 1 || title.length > 100) {
            errors.push('Title must be between 1 and 100 characters');
        }
    }

    if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
        errors.push('Status must be pending, in-progress, or completed');
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
        errors.push('Priority must be low, medium, or high');
    }

    if (dueDate && isNaN(Date.parse(dueDate))) {
        errors.push('Due date must be a valid date');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    next();
};

module.exports = { validateRegister, validateLogin, validateTask };
