const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute); // Add chat routes
app.use("/api/messages", messageRoute); // Add message routes

app.get("/", (req, res) => {
    res.send("Welcome to ChatApp...");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

mongoose.connect(uri)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => console.log("MongoDB NOT connected: ", error.message));
