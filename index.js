const express = require('express');
const app = express();
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');

dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", 'DELETE', 'PATCH']
  }
});

const port = process.env.PORT || 8001;

const bodyParser = require('body-parser');
const dbConnection = require('./cofig/dbConnection');
const userRouter = require('./routes/UserRoutes');
const chatRouter = require('./routes/Chatroutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

app.use('/user', userRouter);
app.use('/message', chatRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ✅ Socket.IO logic
io.on('connection', (socket) => {
    // console.log(socket)
  console.log('A user connected:', socket.id);

  socket.on('updateConfig', (data) => {
    // broadcast the config to all other clients
    socket.broadcast.emit('configUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server with both HTTP and WebSocket support
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on https://192.168.0.15:${port}`);
  dbConnection();
});
