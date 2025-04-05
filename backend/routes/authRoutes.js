const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { registerValidation, loginValidation, validate } = require('../middlewares/validation');

// Register route
router.post('/register', registerValidation, validate, register);

// Login route
router.post('/login', loginValidation, validate, login);

module.exports = router; 