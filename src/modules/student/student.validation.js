import Joi from "joi"
import constant from "../../utils/constant.js"
import Logger from "../../utils/loggers.js";
import { constants } from "fs/promises";
const logger = new Logger().createMyLogger('userValidation');

const joiOptions = {
    errors: {
        wrap: {
            label: ''
        }
    }
};

export default class StudentUserValidation {
    
    /**
     * Middleware that adds meta data in request body which are specific to the module
     * This is must when you want to use common controller. 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static async studentMidllerware(req, res, next) {
        req.model = 'student'; 
        next(); 
    }
    
    static async studentCreateValidation(req, res, next) {
        // Required line in case common controller is used.
        req.model = 'student';

        let userIdSchema = Joi.object().keys({
            email: Joi.string().email({ tlds: { allow: true } }).required(),
            // password:Joi.string().required(),
            student_name: Joi.string().optional(),
            gender: Joi.string().optional(),
            father_name: Joi.string().optional(),
            student_phone: Joi.number().optional(),
            student_wp_phone: Joi.number().optional(),
            student_dob: Joi.string().optional(),
            class_type: Joi.string().optional(),
            course: Joi.string().optional(),
            specific_course: Joi.string().optional(),
            class_time: Joi.string().optional(),
            address: Joi.string().optional(),
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
    // static async userIdValidator(req, res, next) {
    //     let userIdSchema = joi.object().keys({
    //         id: joi.string().required()
    //     });
    //     let result = userIdSchema.validate(req.params, joiOptions);
    //     if (result.error) {
    //         return res.status(400).json({ status: constants.statusFail, message: result.error.details[0].message });
    //     }
    //     else {
    //         return next();
    //     }
    // }
//    Student Update 
    // static async userValidator(req, res, next) {
    //     let userIdSchema = Joi.object().keys({
    //         email: Joi.string().email({ tlds: { allow: true } }).required(),
    //         // password:Joi.string().required(),
    //         student_name: Joi.string().optional(),
    //         // student_last_name: Joi.string().optional(),
    //         father_name: Joi.string().optional(),
    //         student_phone: Joi.number().optional(),
    //         student_wp_phone: Joi.number().optional(),
    //         student_dob: Joi.string().optional(),
    //         class_type: Joi.string().optional(),
    //         course: Joi.string().optional(),
    //         address: Joi.string().optional(),
    //         status: Joi.string().optional(),

    //     });
    //     let result = userIdSchema.validate(req.body, joiOptions);
    //     if (result.error) {
    //         return res.status(400).json({ status: constants.statusFail, message: result.error.details[0].message });
    //     }
    //     else {
    //         return next();
    //     }
    // }
    // static async userLoginValidator(req, res, next) {
    //     let userLoginSchema = Joi.object().keys({
    //         email: Joi.string().email({ tlds: { allow: true } }).required(),
    //         password: Joi.string().required().min(6)
    //     });
    //     let result = userLoginSchema.validate(req.body, joiOptions);
    //     if (result.error) {
    //         return res.status(400).json({ status: constant.statusFail, message: result.error.details[0].message });
    //     }
    //     else {
    //         return next();
    //     }
    // }

    // static async fetchSingleValidation(req, res, next) {
    //     // Required line in case common controller is used.
    //     req.model = 'user';

    //     let company = Joi.object().keys({
    //         id : Joi.string().required(),
    //     });

    //     let result = company.validate(req.params, joiOptions);
    //     if (result.error) {
    //         logger.error("Schema validation failed for user =>" + result.error.details[0].message)
    //         return res.status(400).json({ status: constant.statusFail, message: result.error.details[0].message });
    //     }
    //     else {
    //         return next();
    //     }
    // }

    // static async fetchPaginatedValidation(req, res, next) {
    //     // Required line in case common controller is used.
    //     req.model = 'user';

    //     let company = Joi.object().keys({
    //         page : Joi.string().required(),
    //     });
    //     console.log(req.params);
    //     let result = company.validate(req.params, joiOptions);
    //     if (result.error) {
    //         logger.error("Schema validation failed for user =>" + result.error.details[0].message)
    //         return res.status(400).json({ status: constant.statusFail, message: result.error.details[0].message });
    //     }
    //     else {
    //         return next();
    //     }
    // }
} 