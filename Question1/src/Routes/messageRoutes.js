const express = require('express');
const auth = require('../Middleware/Auth');
const { getRoomMessages } = require('../Controllers/messageController');
const router = express.Router();


router.get('/room/:roomId', auth, getRoomMessages);


module.exports = router;