const Message = require('../Models/Message');
const Room = require('../Models/Room');
const { verifyTokenSocket } = require('../Middleware/Socket');


module.exports = (io) => {
    io.use(async (socket, next) => {
        try {
            await verifyTokenSocket(socket);
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });


    io.on('connection', (socket) => {
        const user = socket.user;
        console.log(`🟢 User connected: ${user.email}`);


        socket.on('joinRoom', async ({ roomId }) => {
            const room = await Room.findById(roomId);
            if (!room) return socket.emit('error', { message: 'Room not found' });
            socket.join(roomId);
            io.to(roomId).emit('userJoined', { userId: user._id, email: user.email });
        });


        socket.on('privateMessage', async ({ roomId, content }) => {
            if (!content) return;
            const msg = await Message.create({ room: roomId, sender: user._id, content });
            const populated = await msg.populate('sender', 'email name');
            io.to(roomId).emit('message', populated);
        });


        socket.on('typing', ({ roomId, isTyping }) => {
            socket.to(roomId).emit('typing', { userId: user._id, email: user.email, isTyping });
        });


        socket.on('disconnect', () => {
            console.log(`🔴 User disconnected: ${user.email}`);
        });
    });
};