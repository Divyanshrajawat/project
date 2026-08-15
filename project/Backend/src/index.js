const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const redisClient = require('./config/redis');

const authRouter = require('./routes/userAuth');

app.use(express.json());
app.use(cookieParser());
app.use('/user', authRouter);



mongoose.connect(process.env.DB_CONNECT_STRING)
    .then(async() => {
        console.log("MongoDB connected successfully");

        await redisClient.connect();
        console.log("Redis connected successfully");

        app.listen(process.env.PORT, () => {
            console.log("Server listening at port number: " + process.env.PORT);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed:", err);
    });