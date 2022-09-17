import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let MatchingModelSchema = new Schema({
    socketID: {
        type: String,
        //unique: true,
        required: true,
    },
    roomID: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    matched: {
        type: Boolean,
        required: true,
    }
})

export default mongoose.model('MatchModel', MatchingModelSchema);