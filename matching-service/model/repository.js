import MatchModel from './matching-model.js';
import 'dotenv/config';
import mongoose from 'mongoose';

mongoose
  .connect(
    process.env.MONGO_DB_URL,
    {
     useNewUrlParser: true,
   }
  )
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
