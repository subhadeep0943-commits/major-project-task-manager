const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

// POST request to register a new user
router.post('/register', validateRegister, userController.registerUser);

// POST request to log in an existing user
router.post('/login', validateLogin, userController.loginUser);

// GET request for current user info
router.get('/me', protect, userController.getMe);

module.exports = router;