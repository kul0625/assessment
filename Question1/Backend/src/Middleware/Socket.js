const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

async function verifyTokenSocket(socket) {
  // client should send token in socket.handshake.auth: { token }
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) throw new Error("No token");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new Error("User not found");
    socket.user = user;
  } catch (err) {
    throw err;
  }
}

module.exports = { verifyTokenSocket };
