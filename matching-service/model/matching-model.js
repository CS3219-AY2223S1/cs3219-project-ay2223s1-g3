import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let MatchingModelSchema = new Schema({
    socketId: {
        type: String,
        unique: true,
        required: true,
    },
    roomId: {
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
    }
})

export default mongoose.model('MatchModel', MatchingModelSchema);