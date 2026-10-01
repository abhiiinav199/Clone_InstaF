import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // Apne frontend ka exact origin dein
        methods: ["GET", "POST"],
        credentials: true
    }
});

const allOnlineUsers = {}; // { [userId]: socketId }

function getReceiverSocketId(receiverId) {
    return allOnlineUsers[receiverId];
}

io.on("connection", (socket) => { // io means whole circuit
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
        allOnlineUsers[userId] = socket.id;
    }

    // Frontend ko active users list bhejne ke liye
    io.emit("send-all-online-users", Object.keys(allOnlineUsers));

    socket.on("disconnect", () => { //socket means individual user
        console.log("User disconnected:", socket.id);

        if (userId && allOnlineUsers[userId] === socket.id) {
            delete allOnlineUsers[userId];
        }

        // Updated users list dobara broadcast karo
        io.emit("send-all-online-users", Object.keys(allOnlineUsers));
    });
});

export { app, httpServer, io, getReceiverSocketId };