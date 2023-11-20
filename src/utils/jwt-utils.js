import jwt from 'jsonwebtoken';
import Logger from './loggers.js';
const logger = new Logger().createMyLogger('jwt-utils');
import dotenv from 'dotenv';
dotenv.config();

/**
 * @param {*} tokenConfig 
 * tokenConfig.uniqueId - uniqueIdentifier
 */
var createToken = (tokenConfig) => {
    let promise = new Promise((resolve, reject) => {
        if (tokenConfig) {
            // logger.debug(process.env.allowedRoles)
            // if (process.env.allowedRoles.includes(tokenConfig.role)) {
            //     logger.info("Valid Role: " + tokenConfig.role);
            //     // reject('Invalid Role');
            // } else {
            //     logger.warn("Role is missing in createToken");
            //     reject('Role is missing');
            // }
            let token = jwt.sign(tokenConfig, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
            if (token) {
                resolve(token);
            } else {
                reject();
            }
        } else {
            reject('token config is null or undefined');
        }
    });
    return promise;
};

var createRefreshToken = (tokenConfig) => {
    let promise = new Promise((resolve, reject) => {
        if (tokenConfig) {
            if (!tokenConfig.uniqueId) {
                logger.info("Token unique id is missing in createToken");
                reject('token unique id is missing');
            }

            let token = jwt.sign(tokenConfig, globalConfig.REFRESH_TOKEN_SECRET, { expiresIn: globalConfig.REFRESH_TOKEN_EXPIRATION });
            if (token) {
                resolve(token);
            } else {
                reject();
            }
        } else {
            reject('token config is null or undefined');
        }
    });
    return promise;
};

var verifyToken = (token, secret) => {
    let promise = new Promise((resolve) => {
        jwt.verify(token, secret, (err, result) => {
            if (err) {
                resolve(false);
            }
            if (result) {
                resolve(result);
            }
        });
    });
    return promise;
};

var ensureToken = (req, res, next) => {
    let bearerHeader = req.header('Authorization');
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(' ');
        var bearerToken = bearer[1];
        // logger.debug('bearer header', bearerToken);
        verifyToken(bearerToken, process.env.TOKEN_SECRET).then((decodedToken) => {
            // injecting decoded token in request variable
            if (decodedToken == false) {
                return res.json({ status: 401, message: 'Unauthorized' });
            }
            req.user = decodedToken;
            // logger.debug("Decoded token ", decodedToken);
            next();
        }).catch((error) => {
            res.json({ status: 'failure', message: 'Token validation failed' });
        });
    }
    else {
        res.json({ status: 'failure', message: 'Missing Authorization Token' });
    }

};


var ensureRefreshToken = (req, res, next) => {
    let bearerHeader = req.header('Authorization');
    // logger.debug('bearer header', bearerHeader);
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(' ');
        var bearerToken = bearer[1];
        verifyToken(bearerToken, globalConfig.REFRESH_TOKEN_SECRET).then((decodedToken) => {
            // injecting decoded token in request variable

            if (decodedToken == false) {

                return res.json({ status: 401, message: 'refresh token expire' });

            }
            req.uniqueId = decodedToken.uniqueId;
            req.refreshToken = bearerToken;
            // logger.debug("Decoded token ", decodedToken.uniqueId);
            next();
        }).catch((error) => {
            res.json({ status: 'failure', message: 'Token validation failed' });
        });
    } else {
        res.json({ status: 'failure', message: 'Invalid token' });
    }
};

var returnToken = async (doc) => {
    let refresh_token = await createRefreshToken({ uniqueId: doc._id });
    let access_token = await createToken({ uniqueId: doc.email, type: 'publisher' });

    let data = {
        'id': doc.id,
        'name': (doc.userName != "") ? doc.userName : doc.email,
        'email': doc.email,
        'role': doc.role,
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token': doc.token,
        'publisherPermission': doc.publisherPermission
    }
    return data;
}



var panelCheckAccessToken = (req, res, next) => {
    let bearerHeader = req.header('Authorization');
    // logger.debug('bearer header', bearerHeader);
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(' ');
        var bearerToken = bearer[1];
        verifyToken(bearerToken, globalConfig.TOKEN_SECRET).then((decodedToken) => {
            // injecting decoded token in request variable

            if (decodedToken == false) {
                return res.json({ status_code: 401, message: 'Unauthorized' });
            }
            req.user = decodedToken;
            // logger.debug("Decoded token ", decodedToken);
            next();
        }).catch((error) => {
            res.json({ status_code: 'failure', message: 'Token validation failed' });
        });
    } else {
        res.status(401).json({ status_code: 400, status: 'failure', message: 'Authorization Header Not send' });
    }
};

export default {
    'createToken': createToken,
    'verifyToken': verifyToken,
    'ensureToken': ensureToken,
    'createRefreshToken': createRefreshToken,
    'ensureRefreshToken': ensureRefreshToken,
    'returnToken': returnToken,
    'panelCheckAccessToken': panelCheckAccessToken
};
