const express = require("express");
const router = express.Router();
const userController = require("../controllers/admin/userController")
router.get('/',userController.dashboard);  
router.get('/login', userController.login);
router.post('/login', userController.loginPost);
router.get('/register', userController.register);
router.post('/register', userController.registerPost);
// Logout
router.get("/logout", userController.logout);
module.exports= router;