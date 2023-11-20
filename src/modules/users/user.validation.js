import Joi from "joi"
import constant from "../../utils/constant.js";
import Logger from "../../utils/loggers.js";
const logger = new Logger().createMyLogger('userValidation');

const joiOptions = {
    errors: { 
        wrap: {
            label: ''
        }
    }
};

export default class UserValidation {
    static async createValidation(req, res, next) {
        // Required line in case common controller is used.
        req.model = 'user';

        let userIdSchema = Joi.object().keys({
            email: Joi.string().email({ tlds: { allow: true } }).required(),
            username: Joi.string().optional(),
            password: Joi.string().required().min(6),
        });

        let result = userIdSchema.validate(req.body, joiOptions);

        if (result.error) {
            logger.error("Schema validation failed for user =>" + result.error.details[0].message)
            return res.status(400).json({ status: constant.statusFail, message: result.error.details[0].message });
        }
        else {
            return next();
        }
    }

    static async userLoginValidator(req, res, next) {
        let userLoginSchema = Joi.object().keys({
            email: Joi.string().email({ tlds: { allow: true } }).required(),
            password: Joi.string().required().min(6)
        });
        let result = userLoginSchema.validate(req.body, joiOptions);
        if (result.error) {
            return res.status(400).json({ status: constant.statusFail, message: result.error.details[0].message });
        }
        else {
            return next();
        }
    }

    static async fetchSingleValidation(req, res, next) {
        // Required line in case common controller is used.
        req.model = 'user';
        
        let company = Joi.object().keys({
            id : Joi.string().required(),
        });

        let result = company.validate(req.params, joiOptions);
        if (result.error) {
            logger.error("Schema validation failed for user =>" + result.error.details[0].message)
            return res.status(400).json({ status: constant.statusFail, message: result.error.details[0].message });
        }
        else {
            return next();
        }
    }

    static async fetchPaginatedValidation(req, res, next) {
        // Required line in case common controller is used.
        req.model = 'user';
        
        let company = Joi.object().keys({
            page : Joi.string().required(),
        });
        console.log(req.params);
        let result = company.validate(req.params, joiOptions);
        if (result.error) {
            logger.error("Schema validation failed for user =>" + result.error.details[0].message)
            return res.status(400).json({ status: constant.statusFail, message: result.error.details[0].message });
        }
        else {
            return next();
        }
    }
} 