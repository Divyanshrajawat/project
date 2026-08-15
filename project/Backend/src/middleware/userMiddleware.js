const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token)
            throw new Error("Token is not present");

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;

        if (!_id) {
            throw new Error("Invalid token");
        }

        const result = await User.findById(_id); // ye user mongodb mei check ho raha
        if (!result) {
            throw new Error("user doesn't exist");
        }

        // ab agr user exist krta hai to ab blocklist ma token check krlo
        const IsBlocked = await redisClient.exists(`token:${token}`);
        if (IsBlocked)
            throw new Error("Invalid Token");

        req.result = result;
        next();

    } catch (err) {
        res.status(401).json({
            message: "Error: " + err.message
        });
    }
};

module.exports = userMiddleware;