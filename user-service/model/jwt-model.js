import mongoose from "mongoose";
var Schema = mongoose.Schema;
let JwtModelSchema = new Schema({
    token: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date,
        expireAfterSeconds: 3600,
        default: Date.now,
    },
});

export default mongoose.model("JwtModel", JwtModelSchema);
