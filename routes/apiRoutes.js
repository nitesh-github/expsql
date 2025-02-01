const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const userController = require("../controllers/api/userController")
router.post('/register',userController.register);
router.post('/login',userController.login);
router.use('/',authMiddleware);
router.get('/getuser',userController.getUser);
router.get('/get-user-list',userController.getUserList);
module.exports= router;