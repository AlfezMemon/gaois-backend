import CommonService from '../../utils/common.services.js';
import Logger from '../../utils/loggers.js';
const logger = new Logger().createMyLogger('UserController');
import { Types } from 'mongoose';

const ObjectId = Types.ObjectId;
// import ObjectId from 'mongoose';
import jwt from '../../utils/jwt-utils.js';
import constants from '../../utils/constant.js';
import crypto from "crypto";
import userModel from "./student.model.js";
// import userService from "./student-service.js"
import { sendEmail, sendEmailtoStudent } from "../../utils/email-util.js";
// const crypto = require("crypto");
// const sha256Hasher = crypto.createHmac("sha256", "zoho secrets");


export default class StudentUserController {
    /**
 * User registration 
 */
    static async studentCreateHandler(req, res) {
        let { email, password, student_name, student_last_name, student_phone, student_wp_phone, student_dob, father_name, class_type, address, course } = req.body;
        // const pass = crypto.createHash('sha256', "amira board").update(password).digest('hex');
        // console.log(pass);
        let userData = {
            email: email,
            // password:password,
            student_name: student_name,
            // student_last_name: student_last_name,
            father_name: father_name,
            student_phone: student_phone,
            student_wp_phone: student_wp_phone,
            student_dob: student_dob,
            class_type: class_type,
            course: course,
            address: address,
            // email: email,
            // password: pass,
            // username: username
        }
        console.log(userData);
        let response = await CommonService.create('student', userData);
        if (response.status == constants.statusSuccess) {
            sendEmail(userData);
            sendEmailtoStudent(userData.email, userData.student_name);
            console.log("Mail Sent");
            return res.status(200).json(response);
        }
        else {
            return res.status(400).json(response);
        }
    }

    /**
     * User login 
     */
    static async login_handler(req, res) {
        let { email, password } = req.body;
        try {
            const pass = crypto.createHash('sha256', "amira board").update(password).digest('hex');
            // console.log(pass);
            let query = { email: email, password: pass };
            let response = await CommonService.getDataByQuery('user', query, {}, true);
            response.jwt = '';
            if (response.status == constants.statusSuccess) {
                logger.debug(response.data)
                response.data.password = "****"
                response.jwt = await jwt.createToken({ email: response.data.email, userId: response.data._id });
                response.message = 'User login success';
                res.status(200).json(response);
            }
            else if (response.status === constants.statusFail) {
                res.status(403).json(response);
            }
            else {
                res.status(500).json(response);
            }
        }
        catch (e) {
            logger.error("Error occurred when creating jwt in login =>", e);
            res.status(500).json({});
        }

    }
    /**
     * Get user profile by id  
     */
    static async get_profile_handler(req, res) {

    }
    /**
     * Update user 
     * @param {*} userData 
     */
    // static async update_user_handler(req, res) {
    //     // static async updateUserHandler(req, res) {
    //     let id = new Types.ObjectId(req.params.id);
    //     let { email, status, student_name, student_last_name, student_phone, student_wp_phone, student_dob, father_name, class_type, address, course } = req.body;

    //     // let { name, profileImg, company, mobile, userType } = req.body;
    //     let userData = {
    //         email: email,
    //         // password:password,
    //         student_name: student_name,
    //         // student_last_name: student_last_name,
    //         father_name: father_name,
    //         student_phone: student_phone,
    //         student_wp_phone: student_wp_phone,
    //         student_dob: student_dob,
    //         class_type: class_type,
    //         course: course,
    //         address: address,
    //         status:status,
    //     }
    //     let response = await userService.updateUser(id, userData);

    //     if (response.status == constants.statusSuccess) {
    //         res.status(200).json(response);
    //     }
    //     else if (response.status === constants.statusFail) {
    //         res.status(400).json(response);
    //     }
    //     else {
    //         return res.status(500).json(response)
    //     }
    // }
}

// module.exports = UserController;