import redis from "redis";
import "dotenv/config";

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
redisClient.on("connection", () => {
    console.log("Connected to redis!");
});

await redisClient.connect();

export async function addToBlacklist(token, tokenExp) {
    try {
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
    const inBlacklist = await redisClient.get(`bl_${token}`);
    return inBlacklist;
}
