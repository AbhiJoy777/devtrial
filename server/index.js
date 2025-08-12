const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require("socket.io");
const { v4: uuidv4 } = require('uuid');
const Question = require('./models/Question.js');
const executionRoutes = require('./routes/executionRoutes.js');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
    cors: { 
        // Split the string into an array of allowed origins
        origin: process.env.FRONTEND_URL.split(','), 
        methods: ["GET", "POST"] 
    } 
});

app.use(express.json());
app.use(cors());
app.use('/api/execute', executionRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ DB Connected'))
    .catch(err => console.error(err));

const matchmakingQueue = { candidate: [], interviewer: [] };
let onlineUsers = {};

io.on('connection', (socket) => {
    console.log(`[Socket.io] ✅ User Connected: ${socket.id}`);

    socket.on('register-peer', (peerId) => {
        onlineUsers[socket.id] = peerId;
        console.log(`[P2P] Registered peer ${peerId} for socket ${socket.id}`);
    });

    socket.on('request-match', ({ role, user }) => {
        const peerId = onlineUsers[socket.id];
        if (!peerId) return console.error("[Matchmaking] Error: User has no registered peer ID.");
        if (!['candidate', 'interviewer'].includes(role)) {
            return console.error("[Matchmaking] Error: Invalid role.");
        }
        matchmakingQueue[role].push({ socket, peerId, user });
        findMatch();
    });

    socket.on('cancel-match', () => {
        for (const role in matchmakingQueue) {
            matchmakingQueue[role] = matchmakingQueue[role].filter(entry => entry.socket.id !== socket.id);
        }
        console.log(`[Matchmaking] Match request cancelled for socket: ${socket.id}`);
    });

    const findMatch = async () => {
        if (matchmakingQueue.candidate.length > 0 && matchmakingQueue.interviewer.length > 0) {
            const candidate = matchmakingQueue.candidate.shift();
            const interviewer = matchmakingQueue.interviewer.shift();

            const roomId = uuidv4();
            candidate.socket.join(roomId);
            interviewer.socket.join(roomId);

            const questionCount = await Question.countDocuments();
            const question = await Question.findOne().skip(Math.floor(Math.random() * questionCount));

            candidate.socket.emit('match-found', {
                roomId,
                role: 'candidate',
                partnerPeerId: interviewer.peerId,
                question
            });

            interviewer.socket.emit('match-found', {
                roomId,
                role: 'interviewer',
                partnerPeerId: candidate.peerId,
                question
            });
        }
    };

    socket.on('signal', ({ to, from, data }) => {
        const targetSocketId = Object.keys(onlineUsers).find(key => onlineUsers[key] === to);
        if (targetSocketId) {
            io.to(targetSocketId).emit('signal-received', { from, data });
        }
    });

    socket.on('code-change', ({ roomId, code }) => {
        socket.to(roomId).emit('code-updated', code);
    });

    socket.on('disconnect', () => {
        console.log(`[Socket.io] ❌ User Disconnected: ${socket.id}`);
        delete onlineUsers[socket.id];
        for (const role in matchmakingQueue) {
            matchmakingQueue[role] = matchmakingQueue[role].filter(item => item.socket.id !== socket.id);
        }
    });
});

const userRoutes = require('./routes/userRoutes.js');
const questionRoutes = require('./routes/questionRoutes.js');

app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);

const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Full Server with P2P running on port ${PORT}`));