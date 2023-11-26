import dotenv from 'dotenv';
import CommonService from './common.services.js';
import constants from './constant.js';
import Logger from './loggers.js';

dotenv.config();
const logger = new Logger().createMyLogger('CommonController');

export default class CommonController {
    /**
     * Common Create Resource Controller method. 
     * Request body must be validated with the help of Joi Middleware 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns standard response; 
     */
    static async create(req, res, next) {
        try {
            let data = [req.body];
            let response = await CommonService.create(req.model, data);
            if (response.status == constants.statusSuccess) {
                return res.status(200).json(response);
            }
            else {
                return res.status(400).json(response);
            }
        }
        catch (e) {
            logger.error("Error occured in Common Controller", e);
            res.status(500).json({ status: statusFail, error: e, data: [] });
        }
    }

    static async getById(req, res, next) {
        try {
            let id = req.params.id;
            let response = await CommonService.getByID(req.model, id);
            if (response.status == constants.statusSuccess) {
                return res.status(200).json(response);
            }
            else {
                return res.status(400).json(response);
            }
        }
        catch (e) {
            logger.error("Error occured in Common Controller", e);
            res.status(500).json({ status: statusFail, error: e, data: [] });
        }
    }

    static async getMultiple(req, res, next) {
        try {
            logger.info(JSON.stringify(req.body.query))
            let page = req.params.page | 1;
            let query = req.body.query ;
            logger.info("Query set to => "+ JSON.stringify(query))
            if (!query) {
                query = {}
            }
            let entriesToSkip = (page - 1) * constants.defaultPageLimit;
            let response = await CommonService.getDataByQuery(req.model,query, { limit: constants.defaultPageLimit, skip: entriesToSkip });
            if (response.status == constants.statusSuccess) {
                return res.status(200).json(response);
            }
            else {
                return res.status(400).json(response);
            }
        }
        catch (e) {
            logger.error("Error occured in Common Controller", e);
            return res.status(500).json({ status: statusFail, error: e, data: [] });
        }
    }

    static async updateById(req,res,next){
        try {
            let id = req.params.id;
            let data = req.body;
            let response = await CommonService.update(req.model, { _id: id }, data, false);
            if (response.status == constants.statusSuccess) {
                return res.status(200).json(response);
            }
            else {
                return res.status(400).json(response);
            }
        }
        catch (e) {
            logger.error("Error occured in Common Controller", e);
            res.status(500).json({ status: statusFail, error: e, data: [] });
        }
    }

    static async deleteById(req, res, next) {
        try {
            let id = req.params.id;
            let response = await CommonService.delete(req.model, { _id: id });
            if (response.status == constants.statusSuccess) {
                return res.status(200).json(response);
            }
            else {
                return res.status(400).json(response);
            }
        }
        catch (e) {
            logger.error("Error occured in Common Controller", e);
            res.status(500).json({ status: statusFail, error: e, data: [] });
        }
    }
} 