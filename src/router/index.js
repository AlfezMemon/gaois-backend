import express from "express";
import UserController from "../modules/users/user.controller.js";
import UserValidation from "../modules/users/user.validation.js";
// import StoreController from "../modules/store/controller.js";
import jwt from "../utils/jwt-utils.js";
import multerUtil from "../utils/multer.utils.js";
import multer from "multer";
// import StoreValidation from "../modules/store/validation.js";
// import PreparationController from "../modules/preparation/controller.js";
import feeModel from "../modules/fee/fee-model.js";
import StudentUserValidation from "../modules/student/student.validation.js";
import StudentUserController from "../modules/student/student.controller.js";
import CommonController from '../utils/common.controller.js';
import FeeMiddleware from "../modules/fee/fee-middleware.js";
const upload = multer({ dest: 'uploads/' });

const app = express();
const router = express.Router();

/**
 * User 
 */
router.post('/user', UserValidation.createValidation, UserController.createHandler);
router.post('/user/login', UserValidation.userLoginValidator, UserController.login_handler);

/**
 * Student page
 */
router.get('/student', StudentUserValidation.studentMidllerware, CommonController.getMultiple);
router.post('/student', StudentUserValidation.studentCreateValidation, StudentUserController.studentCreateHandler);
router.get('/student/:id', StudentUserValidation.studentMidllerware, CommonController.getById);

/* fee records */
router.post('/fee', FeeMiddleware.common, CommonController.create);
router.post('/fee-records', FeeMiddleware.common, CommonController.getMultiple);
router.get('/fee/:id', FeeMiddleware.common, CommonController.getById);
router.put('/fee/:id', FeeMiddleware.common, CommonController.updateById);
// router.put(
//     '/student/:id',
//     StudentUserValidation.userValidator,
//     StudentUserController.update_user_handler
//   );
  

export default router;