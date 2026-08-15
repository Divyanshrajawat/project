const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 20,
            trim: true
        },

        lastName: {
            type: String,
            minLength: 3,
            maxLength: 20,
            trim: true
        },

        emailId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            immutable: true
        },

        password: {
            type: String,
            required: true
        },

        age: {
            type: Number,
            min: 17,
            max: 25
        },

        year: {
            type: Number,
            enum: [1, 2, 3, 4],
            required: true
        },

        branch: {
            type: String,
            required: true,
            trim: true
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"]
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;