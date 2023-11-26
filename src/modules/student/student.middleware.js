import Joi from "joi"
import constant from "../../utils/constant.js";
import Logger from "../../utils/logger.js";
const logger = new Logger().createMyLogger('UserMidllerware');

const joiOptions = {
    errors: {
        wrap: {
            label: ''
        }
    }
};

export default class UserMidllerware {
    /**
     * Middleware that adds meta data in request body which are specific to the module
     * This is must when you want to use common controller. 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static async userMidllerware(req, res, next) {
        req.model = 'user'; 
        next(); 
    }

} 