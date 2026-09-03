const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST request to register a new user
router.post('/register', userController.registerUser);

// POST request to log in an existing user
router.post('/login', userController.loginUser);

module.exports = router;