import UserModel from "./user-model.js";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDB =
    process.env.ENV == "PROD"
        ? process.env.DB_CLOUD_URI
        : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function createUser(params) {
    return new UserModel(params);
}

export async function usernameInDb(username) {
    const exists = await UserModel.exists({ username: username });
    return exists;
}

export async function getUser(username) {
    const user = await UserModel.findOne({ username: username });
    return user;
}

export async function deleteUser(username) {
    const success = await UserModel.deleteOne({ username: username });
    return success;
}
