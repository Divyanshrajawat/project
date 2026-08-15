const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const validator = require("../utils/validator")
const redisClient = require("../config/redis");


const register = async (req,res)=>{
     try{
        // validate the data
       validator(req.body);
       const{firstName,emailId,password} = req.body;
       
       req.body.password = await bcrypt.hash(password,10);
       req.body.role = 'user'
       const user = await User.create(req.body);
       const token = jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:60*60});
       const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        }
       res.cookie('token',token,{maxAge: 60*60*1000});
     }
     catch(err){
        res.status(400).send("Error : "+err);
    }

}


const login = async (req,res)=>{
    try{
        const {emailId,password} = req.body;

        if(!emailId)
            throw new Error("Invalid credentials");

        if(!password)
            throw new Error("Invalid credentials");

        const user = await User.findOne({emailId});

        const match = await bcrypt.compare(password, user.password);

        if(!match)
            throw new Error("Invalid credential");

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        };

        const token = jwt.sign(
            {
                _id: user._id,
                emailId: emailId,
                role: user.role
            },
            process.env.JWT_KEY,
            {expiresIn: 60*60}
        );

        res.cookie('token', token, {
            maxAge: 60*60*1000
        });

        res.status(200).send("logged in successfully");
    }
    catch(err){
        res.status(401).send("Error: " + err);
    }
}

const logout = async (req,res)=>{
    try{
        //jab user,iddleware sa validate hogaya tab ab logout wale feature ma aya hai
        const {token} = req.cookies;
        const payload = jwt.decode(token); // payload nikkal liya


        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp)


        //token added to redis blocklist till its expiry
        // cookies ko clear kr dena

        res.cookie("token",null,{expires: new Date(Date.now())});
        res.send("logged out successfully");

    }
    catch(err){
        res.status(503).send("Error: "+ err);
    }
}

module.exports = {register,login,logout};