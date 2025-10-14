const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');


const connectDB = require('./src/Config/db');
const authRoutes = require('./src/Routes/authRoutes');
const userRoutes = require('./src/Routes/userRoutes');
const roomRoutes = require('./src/Routes/roomRoutes');
const messageRoutes = require('./src/Routes/messageRoutes');
const chatSocket = require('./src/Socket/chatSocket');


dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Web routes
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/chat', (req, res) => res.render('chat'));
// app.get('/users', (req, res) => res.render('users'));

app.get('/chat/:userId', (req, res) => {
  res.render('chat', { receiverId: req.params.userId });
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);


// HTTP + Socket setup
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
chatSocket(io);


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));