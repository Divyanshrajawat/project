const { createClient } = require('redis')   //createClient() ka main kaam hai tumhare Node.js backend aur Redis server ke beech ek client/connection setup karna.
// create client humara lia redis client create krta hai


const redisClient = createClient({ 
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {  //Yahan tum bata rahe ho ki Redis server kahan located hai.
        host: 'imaginative-weather-original-87598.db.redis.io',
        port: 11831

    }
});

redisClient.on("error", (err) => {
    console.log("Redis Client Error:", err);
});



module.exports = redisClient;
