import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"]
    },
});

let onlineUsers = [];

io.on("connection", (socket) => {
    // add user
    socket.on("addNewUser", (userId) => {
        if (!onlineUsers.some((user) => user.userId === userId)) {
            onlineUsers.push({
                userId,
                socketId: socket.id,
            });
        }

        console.log("Connected Users:", onlineUsers);

        // send active users
        io.emit("getUsers", onlineUsers);
    });

    // add message
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(
            (user) => user.userId === message.recipientId
        );

        if (user) {
            console.log("sending message and notification");
            io.to(user.socketId).emit("getMessage", message);
            io.to(user.socketId).emit("getNotification", {
                senderId: message.senderId,
                isRead: false,
                date: new Date(),
            });
        }
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        console.log("User Disconnected:", onlineUsers);

        // send active users
        io.emit("getUsers", onlineUsers);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
