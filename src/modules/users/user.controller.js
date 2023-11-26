import CommonService from '../../utils/common.services.js';
import Logger from '../../utils/loggers.js';
const logger = new Logger().createMyLogger('UserController');

import jwt from '../../utils/jwt-utils.js';
import constants from '../../utils/constant.js';
import crypto from "crypto";
import userModel from "./user.model.js"
// const crypto = require("crypto");
// const sha256Hasher = crypto.createHmac("sha256", "zoho secrets");


export default class UserController {
    /**
     * User registration 
    */
    static async createHandler(req, res) {
        let { email, password, username } = req.body;
        const pass = crypto.createHash('sha256', "amira board").update(password).digest('hex');
        console.log(pass);
        let userData = {
            email: email,
            password: pass,
            username: username
        }
        let response = await CommonService.create('user', userData);
        if (response.status == constants.statusSuccess) {
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
    static async update_user_handler(req, res) {

    }

}

// module.exports = UserController;