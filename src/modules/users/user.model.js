import mongoose from "mongoose";
let Schema = mongoose.Schema

const user = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    username: {
        // type: Number
        type: String
    },
    status:{
        type:String,
        default:"active"
    }
},{
    timestamps: true
});

export default mongoose.model('user', user);