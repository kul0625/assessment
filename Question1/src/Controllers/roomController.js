const Room = require('../Models/Room');


exports.createRoom = async (req, res) => {
try {
const { name, description } = req.body;
const room = await Room.create({ name, description, members: [req.user._id] });
res.json(room);
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};


exports.joinRoom = async (req, res) => {
try {
const room = await Room.findById(req.params.id);
if (!room) return res.status(404).json({ message: 'Room not found' });


if (!room.members.includes(req.user._id)) {
room.members.push(req.user._id);
await room.save();
}
res.json(room);
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};


exports.getRooms = async (req, res) => {
try {
const rooms = await Room.find();
res.json(rooms);
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};