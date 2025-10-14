const express = require('express');
const { register, login } = require('../Controllers/authController');
const auth = require('../Middleware/Auth');
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
module.exports = router;