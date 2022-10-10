import mongoose from 'mongoose';
var Schema = mongoose.Schema;
const questionSchema = new Schema({
  question: {
    type: Number,
    required: true,
    // get: v => Math.round(v),
    // set: v => Math.round(v),
  },
  difficulty: {
    type: String,
    required: true,
    // enum: ['easy', 'medium', 'hard']
  },
  _id: false
})
const HistoryModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  questionsDone: [questionSchema]
});

export default mongoose.model('HistoryModel', HistoryModelSchema);
