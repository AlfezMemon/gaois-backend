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
        type: String,
        default: "-"
    },
    student_phone: {
        type: Number,
        required: true,
 
    },
    student_wp_phone: {
        type: Number,
        required: true,
    },
    student_name: {
        type: String,
        required: true,
 
    },
    // student_last_name: {
    //     type: String,
    //     required: true,
 
    // },
    father_name: {
        type: String,
        required: true,
 
    },
    address: {
        type: String,
        required: true,
 
    },
    class_type: {
        type: String,
        required: true,
 
    },
    student_dob: {
        type: String,
        required: true,
 
    },
    course: {
        type: String,
        required: true,
    },

    // password: {
    //     type: String,
    //     required: true
    // },
    // username: {
    //     type: Number
    // },
    status: {
        type: String,
        default: "pending"
    }
}, {
    timestamps: true
});

export default mongoose.model('student', student);