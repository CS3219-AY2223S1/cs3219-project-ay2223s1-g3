import HistoryModel from './history-model.js';
import 'dotenv/config';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createHistory(username, questionsDone) {
  return new HistoryModel({
    username: username,
    questionsDone: questionsDone,
  });
}

export async function historyInDb(username) {
  const exists = await HistoryModel.exists({ username: username });
  return exists;
}

export async function deleteHistory(username) {
  const success = await HistoryModel.deleteOne({ username: username });
  return success;
}

export async function getQuestionsDone(username) {
  const user = await HistoryModel.findOne({ username: username });
  return user.questionsDone;
}

export async function addQuestionDone(username, questionDone) {
  const success = await HistoryModel.findOneAndUpdate(
    { username: username },
    { $addToSet: { questionsDone: questionDone } }
  );
  return success;
}
