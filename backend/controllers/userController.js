const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Register a new user
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });
    await newUser.save();

    // Generate a JWT Token so the user is auto-logged-in after registration
    const token = jwt.sign(
        { userId: newUser._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );

    res.status(201).json({ token, userId: newUser._id, name: newUser.name });
});

// Log in an existing user
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Generate a JWT Token valid for 1 day
    const token = jwt.sign(
        { userId: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );

    res.status(200).json({ token, userId: user._id, name: user.name });
});

// Get current user details
exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user).select('-password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    });
});