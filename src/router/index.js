import express from "express";
import UserController from "../modules/users/user.controller.js";
import UserValidation from "../modules/users/user.validation.js";
// import StoreController from "../modules/store/controller.js";
import jwt from "../utils/jwt-utils.js";
import multerUtil from "../utils/multer.utils.js";
import multer from "multer";
// import StoreValidation from "../modules/store/validation.js";
// import PreparationController from "../modules/preparation/controller.js";
import StudentUserValidation from "../modules/student/student.validation.js";
import StudentUserController from "../modules/student/student.controller.js";

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
router.post('/student', StudentUserValidation.studentCreateValidation, StudentUserController.studentCreateHandler);
// router.put(
//     '/student/:id',
//     StudentUserValidation.userValidator,
//     StudentUserController.update_user_handler
//   );
  

export default router;