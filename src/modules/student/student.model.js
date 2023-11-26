// import { boolean, date } from "joi";
// import { string } from "joi";
import mongoose from "mongoose";
let Schema = mongoose.Schema; 

const student = new Schema({
    email: {
        type: String,
        required: true,
    },
    student_id : {
        type: Number,
        default: 0
    },
    student_phone: {
        type: Number,
        required: true
    },
    student_wp_phone: {
        type: Number,
        required: true,
    },
    student_name: {
        type: String,
        required: true,
    },
    father_name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    class_type: {
        type: String,
        required: true 
    },
    student_dob: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending","cancel","confirm","hold", "deactive", "completed"]
    }, 
    monthly_fees: {
        type: Number, 
        default : 0
    },
    carried_forward : {
        type: Number,
        default: 0
    }, 
    remaining_fees: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model('student', student);