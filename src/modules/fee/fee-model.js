import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
let Schema = mongoose.Schema;

const fees = new Schema({
    student_id: {
        type: ObjectId,
        required: true
    },
    monthly_fees: {
        type: Number,
        required: true
    },
    received_amount: {
        type: Number,
        required: true
    },
    received_date: {
        type: Date,
        required: true
    },
    paymentMode: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

export default mongoose.model('fee_transaction', fees);