import userModel from './user.model';
import userFriendshipModel from './user-friendship.model';
import constants from '../../utils/constants';
import logger from '../../utils/logger';
import jwt from '../../utils/jwt-utils';
import { renameProp } from '../../utils/common-functions';
import { Types } from 'mongoose';
import _ from 'lodash';

     
class Student {
    /**
     * Create user 
     * @param {*} user 
     * @returns {boolean success} 
     */
    // static async createUser(user) {
    //     try {
    //         let newUser = new userModel({
    //             name: user.name,
    //             mobile: user.mobile,
    //             role: constants.userRole,
    //             userType: user.userType
    //         });
    //         if (user.profileImg) {
    //             if (user.userType != constants.userTypeIndividual && user.company) {
    //                 let companyData = await Company.getCompany({ _id: ObjectId(user.company) }, { logo:1 });
    //                 if (companyData.data.logo) {
    //                     console.log([companyData.data.logo, user.profileImg]);
    //                     let combinedImage = await CombineImageUtil.combine([companyData.data.logo, user.profileImg]);
    //                     console.log(combinedImage.data.location);
    //                     if ( combinedImage.data.location ){ 
    //                         newUser.profileImg = combinedImage.data.location; 
    //                     }
    //                 }   
    //             }
    //             else {
    //                 newUser.profileImg = user.profileImg;
    //             }
    //             console.log();
    //         }
    //         if (user.company) {
    //             newUser.company = user.company;
    //         }
    //         if (user.parent_user_id) {
    //             newUser.parent_user_id = user.parent_user_id
    //         }
    //         newUser.jwt = await jwt.createToken({
    //             userId: newUser._id,
    //             userType: user.userType,
    //             sub_users: []
    //         });
    //         let response = await newUser.save();
    //         if (response) {
    //             return { status: constants.statusSuccess, message: "User created", data: { token: newUser.jwt } }
    //         }
    //         else {
    //             return { status: constants.statusFail, message: "User could not be created", token: '' }
    //         }
    //     }
    //     catch (error) {
    //         logger.error("Error occurred when creating user => ", error);
    //         console.error(error);
    //         if (error.code === 11000) {
    //             return { status: constants.statusFail, message: "User already exists", token: '' }
    //         }
    //         else {
    //             return { status: constants.statusFail, message: "User can not be created", token: '' }
    //         }
    //     }
    // }
    /**
     * Update User
     * @param {*} user 
     * @returns {boolean success} 
     */
    static async updateUser(id, user) {
        try {
            let response = await userModel.updateOne({ _id: id }, { $set: user }).exec();
            if (response) {
                return { status: constants.statusSuccess, message: "User updated" }
            }
            else {
                return { status: constants.statusFail, message: "User could not be updated" }
            }
        }
        catch (e) {
            logger.error("Error occurred when updating user => ", e);
            return { status: constants.statusFail, message: "User can not be updated" }
        }
    }
    /**
     * Get user details by ID 
     * @param {*} user_id 
     * @returns { userObject }
     */
    static async getUser(query, project = {}) {
        try {
            let response = await userModel.findOne(query, project).exec();
            if (response) {
                return { status: constants.statusSuccess, message: "User found", data: response };
            }
            else {
                return { status: constants.statusFail, message: "User not found", data: {} };
            }
        }
        catch (e) {
            logger.error("Error occured while fetching user =>", e);
            return { status: constants.statusFail, message: constants.unexpectedError, data: {} };
        }
    }
    
    /**
     * Delete user 
     * @param {*} user_id 
     * @returns {boolean success} 
     */
    static async deleteUserById(user_id) {
        try {
            let response = await userModel.deleteOne({ _id: ObjectId(user_id), role: constants.userRole }).exec();
            if (response) {
                return { status: constants.statusSuccess, message: "User deleted", data: response };
            }
            else {
                return { status: constants.statusFail, message: "User couldn't be deleted", data: {} };
            }
        }
        catch (e) {
            logger.error("Error occured while deleting user =>", e);
            return { status: constants.statusFail, message: constants.unexpectedError, data: {} };
        }
    }

    /**----------------------------------------
     *  User Friendship  
    ------------------------------------------*/
    /**
     * Send Request of friendship 
     * @param {*} friendshipRequest
     * @param friendshipRequest.from 
     * @param friendshipRequest.to  
     */
    static async requestFriendship(friendshipRequest) {
        try {
            let newFriendRequest = {
                from: ObjectId(friendshipRequest.from),
                to: ObjectId(friendshipRequest.to),
                status: friendshipRequest.status
            };
            let response = await userFriendshipModel.updateOne({ from: ObjectId(friendshipRequest.from), to: ObjectId(friendshipRequest.to) }, newFriendRequest, { upsert: true }).exec();
            logger.error(JSON.stringify(response));
            if (response) {
                let msg = "Friendship request sent";
                if (response.matchedCount > 0) {
                    msg = "User Friendship request already exists"
                }
                return { status: constants.statusSuccess, message: "Friendship request sent", message: msg }
            }
            else {
                return { status: constants.statusFail, message: "User Friendship request could not be created" }
            }
        }
        catch (error) {
            logger.error("Error occurred when creating user friendship request => ", error);
            if (error.code === 11000) {
                updating
                return { status: constants.statusFail, message: "User Friendship request already exists" }
            }
            else {
                return { status: constants.statusFail, message: "User Friendship request can not be sent" }
            }
        }
    }
    /**
     * Get list of current user's Friend Requests
     */
    static async getListOfFriendRequests(userId, match, key = 'from') {
        try {
            // console.log(match);
            // let toIds = []; 
            let lookup = [
                {
                    $match: match
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: key,
                        foreignField: '_id',
                        as: 'list'
                    }
                },
                {
                    $unwind: { path: "$list", preserveNullAndEmptyArrays: true }
                },
                {
                    $project: {
                        "__v": 0,
                        // "list.name" : 0,
                        key: 0,
                        "list.__v": 0,
                        "list.created": 0,
                        "list.userType": 0,
                        "list.role": 0,
                        'list.friends': 0
                    }
                }
            ];
            // console.log(lookup);
            let userRequests = await userFriendshipModel.aggregate(lookup).exec();

            if (userRequests) {
                userRequests = userRequests.map((rec) => {
                    renameProp(rec, '_id', 'recId');
                    renameProp(rec, key, 'userId');

                    if (rec.list) {
                        renameProp(rec.list, '_id', 'friendId');
                    }

                    let obj = _.merge(rec, rec.list);

                    delete rec.list;
                    return obj;
                });
                console.log(userRequests.length);
                if (userRequests.length > 0) {
                    return { status: constants.statusSuccess, message: "List of friend requests -", data: userRequests }
                }
                else {
                    return { status: constants.statusFail, message: "Friend requests doesn't exist", data: [] }
                }
            }
            else {
                return { status: constants.statusFail, message: "Friend requests doesn't exist", data: [] }
            }
        }
        catch (e) {
            console.log(e);
            logger.error("Error occurred when fetching list of friend requests => ", e);
            return { status: constants.statusFail, message: "Could not fetch the list of friend requests" }
        }
    }
    /**
     * Response of frienship request 
     * @param { reqId } data 
     * @param { from } data 
     * @param { to } data 
     */
    static async replyFrienshipRequest(data) {
        try {
            /** If friendship request accepted then add both users to users.friends */
            if (data.status == constants.friendshipReqStatusAccepted) {
                let request = await userFriendshipModel.findById(ObjectId(data.id)).exec();
                if (request) {
                    if (request.to.toString() === data.to) {
                        logger.debug("Request exists :", JSON.stringify(request));
                        logger.debug();
                        let senderFriend = { _id: ObjectId(data.to), status: constants.friendshipStatusActive };
                        let receiverFriend = { _id: ObjectId(data.from), status: constants.friendshipStatusActive };
                        let updateSender = await userModel.updateOne({ _id: data.from }, { $addToSet: { friends: senderFriend } });
                        let updateReceiver = await userModel.updateOne({ _id: data.to }, { $addToSet: { friends: receiverFriend } });

                        let friend_id_user_id = [senderFriend, receiverFriend].sort();
                        let chatroom_id = friend_id_user_id.sort().join('_');

                        if (updateSender && updateReceiver) {
                            /// Let it delete in Background 
                            let deleted = userFriendshipModel.deleteOne({ _id: data.id }).exec();
                            if (deleted) {
                                logger.info("Deleted the accepted request record");
                            }
                            else {
                                logger.info("Could not delete the accepted request record");
                            }

                            return { status: constants.statusSuccess, message: "Friendship Request updated", data: { chatroom_id: chatroom_id } }
                        }
                        else {
                            return { status: constants.statusFail, message: "Friendship Request could not be updated", data: {} }
                        }
                    }
                    return { status: constants.statusFail, message: "Sender cannot accept request", data: {} }
                }
                else {
                    return { status: constants.statusSuccess, message: "Request already accepted", data: {} }
                }
            } else {
                let response = await userFriendshipModel.updateOne({ _id: data.id }, { $set: { status: data.status } }).exec();
                if (response) {
                    return { status: constants.statusSuccess, message: "Friendship Request updated", data: [] }
                }
                else {
                    return { status: constants.statusFail, message: "Friendship Request could not be updated", data: [] }
                }
            }

        }
        catch (e) {
            logger.error("Error occurred when updating friend request response => ", e);
            return { status: constants.statusFail, message: "Failed to update the friendship request", data: '' }
        }
    }
    static async updateFriendStatus(data) {
        try {
            console.log(data);
            let update = await userModel.updateOne({ _id: data.userId, friends: { _id: data.friendId } }, { $set: { 'friends.$.status': data.status } }).exec();
            if (update) {
                console.log(update);
                return { status: constants.statusSuccess, message: "Updated the friendship status", data: [] }
            }
            else {
                return { status: constants.statusFail, message: "cannot update the friendship status", data: [] }
            }
        } catch (e) {
            logger.error("Error occurred when updating friendship status response => ", e);
            return { status: constants.statusFail, message: "Failed to update the friendship status", data: [] }
        }
    }
    /**
     * Get list of Friends 
     */
    static async getListOfFriends(userId) {
        try {
            let user = await userModel.findById(userId).exec();
            let friendIds = [];
            let noFriends = { status: constants.statusFail, message: "No Friends found", data: [] };

            console.log(user._id);
            if (user) {
                // Grab Ids of friends 
                friendIds = user.friends.map((friend) => {
                    return friend._id;
                });

                if (friendIds.length) {
                    // Fetch all friends data by ids 
                    let friends = await userModel.find(
                        {
                            _id: { $in: friendIds }
                        },
                        { name: 1, _id: 1, mobile: 1, chatroomId: 1, profileImg: 1 }
                    ).lean().exec();


                    if (friends) {
                        let q = friends.map((ele, i) => {

                            let friend_id_user_id = [ele._id, user._id].sort();
                            let chatroom_id = friend_id_user_id.sort().join('_');

                            let statusObj = {
                                status: user.friends[i].status,
                                chatroom_id: chatroom_id,
                            };

                            if (!ele.profileImg) {
                                statusObj.profileImg = null;
                            }

                            // console.log("In Loop", statusObj);
                            return _.merge(ele, statusObj);
                        });
                        logger.debug(JSON.stringify(q));
                        return { status: constants.statusSuccess, message: "Friends list fetched", data: friends };

                    }
                    else {
                        return noFriends;
                    }
                }
                else {
                    return noFriends;
                }
            } else {
                return noFriends;
            }
        }
        catch (e) {
            logger.error("Error occurred when fetching list of friend request", e);
            return { status: constants.statusFail, message: "Failed to fetch friends list", data: [] }
        }
    }
    /**
     * Get Latest updates 
     */
    static async getDelta(userId, last_sync_time) {
        try {
            let user = await userModel.findById(userId).exec();
            let friendIds = [];
            let noFriends = { status: constants.statusFail, message: "No Friends found", data: [] };
            console.log(user._id);
            console.log(last_sync_time);
            if (user) {
                // Grab Ids of friends 
                let last_sync = ISODate(last_sync_time);
                // last_sync_time = last_sync_time
                // var now = new Date();
                // var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

                console.log("Last Sync " + last_sync_time, new Date(last_sync_time));
                friendIds = user.friends.map((friend) => {
                    let updated = new Date(friend.updatedAt);
                    console.log("Date : ", updated);
                    if (last_sync_time < updated) {
                        return friend._id;
                    }
                });
                if (friendIds.length) {

                    // Fetch all friends data by ids 
                    let friends = await userModel.find(
                        {
                            _id: { $in: friendIds },
                            // updatedAt : { $gt : new Date(last_sync_time) } 
                        },
                        { name: 1, _id: 1, mobile: 1, chatroomId: 1, }
                    ).lean().exec();

                    if (friends) {
                        let q = friends.map((ele, i) => {

                            let friend_id_user_id = [ele._id, user._id].sort();
                            let chatroom_id = friend_id_user_id.sort().join('_');

                            let statusObj = {
                                status: user.friends[i].status,
                                chatroom_id: chatroom_id,
                            };

                            // console.log("In Loop", statusObj);
                            return _.merge(ele, statusObj);
                        });
                        logger.debug(JSON.stringify(q));
                        return { status: constants.statusSuccess, message: "Friends list fetched", data: friends };
                    }
                    else {
                        return noFriends;
                    }
                }
                else {
                    return noFriends;
                }
            } else {
                return noFriends;
            }
        }
        catch (e) {
            logger.error("Error occurred when fetching list of friend request", e);
            return { status: constants.statusFail, message: "Failed to fetch friends list", data: [] }
        }
    }
}

export default student; 