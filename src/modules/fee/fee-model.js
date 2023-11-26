import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;  
let Schema = mongoose.Schema; 

const fees = new Schema({
    student_id : {
        type: ObjectId
    },  
    monthly_fees: {
        type: Number
    },
    received_amount: {
        type: Number
    }
}, {
    timestamps: true
});

export default mongoose.model('fee_transaction', fees);