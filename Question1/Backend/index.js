const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const connectDB = require("./src/Config/db");
const authRoutes = require("./src/Routes/authRoutes");
const chatSocket = require("./src/Socket/chatSocket");

dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);

// HTTP + Socket setup
const io = new Server(server, {
  cors: { origin: "*" },
});
chatSocket(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
