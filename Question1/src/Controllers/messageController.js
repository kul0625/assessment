const Message = require('../Models/Message');


exports.getRoomMessages = async (req, res) => {
try {
const { roomId } = req.params;
const messages = await Message.find({ room: roomId })
.sort({ createdAt: 1 })
.populate('sender', 'name email');
res.json(messages);
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};