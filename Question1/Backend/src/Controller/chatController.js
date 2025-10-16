const Room = require("../Models/roomModel");
const Message = require("../Models/messageModel");
const mongoose = require("mongoose");

exports.getOrCreateRoom = async (userId1, userId2) => {
  let room = await Room.findOne({
    members: { $all: [userId1, userId2] },
  }).lean();
  if (!room) {
      room = await Room.create({ members: [userId1, userId2] });
    }
  return room;
};

// Save a message
exports.saveMessage = async ({ roomId, sender, receiver, text }) => {
  const message = await Message.create({ roomId, sender, receiver, text });
  return message;
};

exports.getMessagesByRoom = async (roomId, skip = 0, limit = 100) => {
  try {
    const roomObjectId = new mongoose.Types.ObjectId(roomId);
    const messages = await Message.find({ roomId: roomObjectId })
      .sort({ createdAt: 1 }) // oldest first
      .skip(skip)
      .limit(limit);
    return messages;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching messages");
  }
};
