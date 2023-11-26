import mongoose from "mongoose";
import constant from "./constant.js";
import Logger from './loggers.js';
const logger = new Logger().createMyLogger('CommonService');

/**
 * @class CommonService
 * Depends on Logger module Winston  
 * MongoDB Helper class for APIs.
 * Written and Meant to use only for TheSecondWheel Projects 
 * @author Moin Memon  
 */
export default class CommonService {
    /**
     * Common function to create entries in collection
     * @param {*} collectionName 
     * @param {Array} data 
     * @return { status, error, data }
     */
    static async create(collectionName, data) {
        try {
            if (!collectionName) return { status: constant.statusFail, error: "Collection Name is required", data: {} }
            let created = await mongoose.model(collectionName).insertMany(data);
            logger.debug(`Performing Query on Create ${collectionName} started`);
            if (created) {
                logger.debug(`Performing Query on Create ${collectionName} Finished with result Success`);
                return { status: constant.statusSuccess, error: null, data: {} };
            }
            else {
                logger.debug(`Performing Query on Create ${collectionName} Finished with Result Failure`);
                return { status: constant.statusFail, error: null, data: {} };
            }
        } catch (e) {
            logger.error(`Error occurred while creating entry in collection ${collectionName} => ${e}`);
            return { status: constant.statusFail, error: e, data: {} };
        }
    }

    /**
     * Common function to get entry by id 
     * @param {*} collectionName 
     * @param {*} id 
     * @returns { status, error, data }
     */
    static async getByID(collectionName, id) {
        try {
            if (!collectionName) return { status: constant.statusFail, error: "Collection Name is required", data: {} }

            let data = await mongoose.model(collectionName).findById(id).exec();

            if (data) {
                logger.debug(`Performing Query on Get By ID ${collectionName} Finished with result Success`);
                return { status: constant.statusSuccess, error: null, data: data };
            }
            else {
                logger.debug(`Performing Query on Get By ID ${collectionName} Finished with Result Failure`);
                return { status: constant.statusFail, error: null, data: {} };
            }
        }
        catch (e) {
            logger.error(`Error occurred while creating entry in collection ${collectionName} => ${e}`);
            return { status: constant.statusFail, error: e, data: {} };
        }
    }

    /**
     * Common function to get entries from collection based on query var.  
     * @param {*} collectionName 
     * @param {*} query 
     * @param { limit, sort, skip } constraint
     * @param {Boolean} single 
     * @param {Boolean} aggregration 
     * @return { status, error, data }
     * Only pass constraint in case of multi queries, where single is false. 
     * If single set to true then only one result will be returned. 
     * If aggregration set to true then pass lookup object in query. 
     */
    static async getDataByQuery(collectionName, query, constraint = { limit: constant.defaultPageLimit, sort: {}, skip: 0, pagination: true }, single = false, aggregration = false) {
        try {
            if (!collectionName) return { status: constant.statusFail, error: "Collection Name is required", data: {} }
            let data = [];
            let totalPage = 0;
            logger.debug(`Performing getDataByQuery on ${collectionName} started`);
            if (aggregration) {
                logger.debug(`Query Type Received : Aggregation`)
                logger.debug(`Performed getDataByQuery on ${collectionName} Finished with result Success`);
                totalPage = (await mongoose.model(collectionName).aggregate(query).exec()).length;
                if(constraint.pagination){
                    query.push({$skip: constraint.skip},{$limit: constraint.limit})
                }
                data = await mongoose.model(collectionName).aggregate(query).exec();
                console.log(totalPage);
                totalPage = Math.ceil(totalPage / constraint.limit);
            }
            else if (single) {
                logger.debug(`Query Type Received : Single`)
                data = await mongoose.model(collectionName).findOne(query).exec();
            }
            else {
                logger.debug(`Query Type Received : Multi`)
                if(constraint.pagination){
                    data = await mongoose.model(collectionName).find(query).skip(constraint.skip).limit(constraint.limit).sort(constraint.sort).exec();
                    totalPage = await mongoose.model(collectionName).countDocuments(query);
                    totalPage = Math.ceil(totalPage / constant.defaultPageLimit);
                }else{
                    data = await mongoose.model(collectionName).find(query).sort(constraint.sort).exec();
                }
            }
            if (data) {
                logger.debug(`Performing Query on getByQuery ${collectionName} Finished with result Success`);
                if (single || !constraint.pagination){
                    return { status: constant.statusSuccess, error: null, data: data };
                }else{
                    return { status: constant.statusSuccess, error: null, data: data, totalPage: totalPage };
                }
            }
            else {
                logger.debug(`Performing Query on Create ${collectionName} Finished with Result Failure`);
                return { status: constant.statusFail, error: null, data: [], totalPage: totalPage };
            }
        }
        catch (e) {
            logger.error(`Error occurred while creating entry in collection ${collectionName} => ${e}`);
            return { status: constant.statusFail, error: e, data: [], totalPage : 0 };
        }
    }

    /**
     * Common functions to update entries in collection 
     * @param {*} collectionName 
     * @param {*} query 
     * @param {Object} dataToUpdate 
     * @param {Boolean} updateMany 
     * @param {Boolean} upsert 
     */
    static async update(collectionName, query, dataToUpdate, updateMany = true, upsert = false) {
        try {
            if (!collectionName) return { status: constant.statusFail, error: "Collection Name is required", data: {} }
            let updated = false;
            logger.debug(`Performing Query on Update ${collectionName} started`);
            if (updateMany) {
                updated = await mongoose.model(collectionName).updateMany(query, dataToUpdate, { upsert: upsert }).exec();
            }
            else {
                updated = await mongoose.model(collectionName).updateOne(query, dataToUpdate, { upsert: upsert }).exec();
            }
            if (updated) {
                logger.debug(`Performing Query on Update ${collectionName} Finished with result Success`);
                return { status: constant.statusSuccess, error: null, data: [] };
            }
            else {
                logger.debug(`Performing Query on Update ${collectionName} Finished with Result Failure`);
                return { status: constant.statusFail, error: null, data: [] };
            }
        }
        catch (e) {
            logger.error(`Error occurred while Updating entry in collection ${collectionName} => ${e}`);
            return { status: constant.statusFail, error: e, data: [] };
        }
    }


    /**
     * Common functions to delete entries in collection 
     * @param {*} collectionName 
     * @param {*} query 
     * @param {Boolean} deleteMany  
     */
    static async delete(collectionName, query, deleteMany = false) {
        try {
            if (!collectionName) return { status: constant.statusFail, error: "Collection Name is required", data: {} }
            let deleted = false;
            logger.debug(`Performing Delete Query on ${collectionName} started`);
            if (deleteMany) {
                deleted = await mongoose.model(collectionName).deleteMany(query).exec();
            }
            else {
                deleted = await mongoose.model(collectionName).deleteOne(query).exec();
            }
            if (deleted) {
                logger.debug(`Performing Delete Query on ${collectionName} Finished with result Success`);
                return { status: constant.statusSuccess, error: null, data: [] };
            }
            else {
                logger.debug(`Performing Delete Query on ${collectionName} Finished with Result Failure`);
                return { status: constant.statusFail, error: null, data: [] };
            }
        }
        catch (e) {
            logger.error(`Error occurred while Deleting entry from collection ${collectionName} => ${e}`);
            return { status: constant.statusFail, error: e, data: [] };
        }
    }
}