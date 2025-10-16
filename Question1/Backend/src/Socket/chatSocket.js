const jwt = require("jsonwebtoken");
const chatController = require("../Controller/chatController");

module.exports = (io) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.user.id);

    // Join a room
    socket.on("joinRoom", async (otherUserId) => {
      // If roomId not provided, create/find room
      let room = await chatController.getOrCreateRoom(
        socket.user.id,
        otherUserId
      );
      room._id = room._id.toString();
      socket.join(room._id);
      console.log(`${socket.user.id} joined room ${room._id}`);

      // Send previous messages to this user
      const messages = await chatController.getMessagesByRoom(room._id);
      socket.emit("previousMessages", { messages, roomId: room._id });
    });
    // Handle sending message
    socket.on("message", async (data) => {
      const { text, roomId, receiverId } = data;
      if (!text || !roomId || !receiverId) return;

      const message = await chatController.saveMessage({
        roomId,
        sender: socket.user.id,
        receiver: receiverId,
        text,
      });
      // Broadcast to everyone in room
      socket.to(roomId).emit("getMessage", {
        _id: message._id,
        text: message.text,
        sender: socket.user.id,
        receiver: receiverId,
        createdAt: message.createdAt,
      });
    });

    // Typing indicator
    socket.on("typing", (data) => {
      const { roomId, isTyping } = data;
      socket.to(roomId).emit("typing", { user: socket.user.id, isTyping });
    });
    socket.on("stopTyping", (data) => {
      const { roomId, isTyping } = data;
      socket.to(roomId).emit("stopTyping", { user: socket.user.id, isTyping });
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.user.id);
    });
  });
};
