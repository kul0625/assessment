const express = require('express');
const {getAllUsers } = require('../Controllers/authController');
const auth = require('../Middleware/Auth');
const router = express.Router();

router.get('/', getAllUsers);

module.exports = router;
