import redis from "redis";
import "dotenv/config";
import JwtModel from "./jwt-model.js";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDB =
    process.env.ENV == "PROD"
        ? process.env.DB_CLOUD_URI
        : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const redisHost = process.env.REDIS_CLOUD_IP;
const redisPort = process.env.REDIS_CLOUD_PORT;
const redisPw = process.env.REDIS_CLOUD_PW;

const redisClient = redis.createClient({
    socket: {
        host: redisHost,
        port: redisPort,
    },
    password: redisPw,
});
redisClient.on("error", (err) => {
    console.log(`Unable to create redis with error: ${err}`);
});
redisClient.on("connect", () => {
    reloadRedis();
    console.log("Connected to redis!");
});

await redisClient.connect();

export async function addToBlacklist(token, tokenExp) {
    try {
        const tokenModel = new JwtModel({ token });
        tokenModel.save();
        const token_key = `bl_${token}`;
        await redisClient.set(token_key, token);
        redisClient.expireAt(token_key, tokenExp);
        return true;
    } catch (err) {
        console.log(
            "Error occurred when adding token to redis blacklist database."
        );
        console.log(err);
        return false;
    }
}

export async function inBlacklist(token) {
    await redisClient.get(`bl_${token}`, async (err, res) => {
        if (err) {
            reloadRedis();
            return await redisClient.get(`bl_${token}`);
        }
        return res;
    });
}

function reloadRedis() {
    JwtModel.find({}, (err, jwts) => {
        if (err) console.log("Unable to retrieve JWTs from MongoDB.");
        jwts.map(async (jwt) => {
            console.log(jwt);
            let token = jwt.token;
            if (!(await redisClient.get(`bl_${token}`))) {
                let token_key = `bl_${token}`;
                await redisClient.set(token_key, token);
            }
        });
    });
}
