const express = require('express');
const auth = require('../Middleware/Auth');
const { createRoom, joinRoom, getRooms } = require('../Controllers/roomController');
const router = express.Router();


router.post('/', auth, createRoom);
router.post('/:id/join', auth, joinRoom);
router.get('/', auth, getRooms);


module.exports = router;