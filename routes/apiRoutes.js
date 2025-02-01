const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const userController = require("../controllers/api/userController")
const multerUpload = require('../middlewares/multerUpload');
router.post('/register',userController.register);
router.post('/login',userController.login);
router.use('/',authMiddleware);
router.get('/getuser',userController.getUser);
router.get('/get-user-list',userController.getUserList);
router.post('/upload-user-csv',multerUpload.single('user_csv'), userController.uploadUserCsv);
module.exports= router;