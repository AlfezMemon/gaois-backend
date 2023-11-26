import Joi from "joi"
import Logger from "../../utils/loggers.js";
const logger = new Logger().createMyLogger('FeeMiddleware');

const joiOptions = {
    errors: {
        wrap: {
            label: ''
        }
    }
};

export default class FeeMiddleware {
    /**
     * Middleware that adds meta data in request body which are specific to the module
     * This is must when you want to use common controller. 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static async common(req, res, next) {
        req.model = 'fee_transaction'; 
        next(); 
    }

} 