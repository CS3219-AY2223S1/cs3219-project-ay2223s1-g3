import MatchModel from "./matching-model.js";
import "dotenv/config";
import mongoose, { mongo } from "mongoose";

let mongoUrl =
  process.env.NODE_ENV == "test"
    ? process.env.MONGO_TEST_DB_URL
    : process.env.MONGO_DB_URL;
    
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

let db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

// ?? why tf is this even async (copied from UserModel.js)
export async function createMatch(params) {
  return new MatchModel(params);
}

export async function findMatchDocument(socketId) {
  return await MatchModel.findOne({
    socketID: socketId,
  });
}

export async function deleteMatches(roomID) {
  return await MatchModel.deleteMany({
    roomID: roomID,
  });
}

export async function findMatchAndUpdate(difficulty, boolean) {
  return await MatchModel.findOneAndUpdate(
    { difficulty: difficulty, matched: false },
    {
      $set: {
        matched: boolean,
      },
    }
  );
}
