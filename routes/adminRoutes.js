const express = require("express");
const router = express.Router();
const userController = require("../controllers/admin/userController")
const multerUpload = require('../middlewares/multerUpload');
router.get('/',userController.dashboard);  
router.get('/login', userController.login);
router.post('/login', userController.loginPost);
router.get('/register', userController.register);
router.post('/register', userController.registerPost);

const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/admin/login');
    }
    next();
  };

router.use("/",isAuthenticated);
// Logout
router.get("/user", userController.userlist);
router.get("/user/edit/:id", userController.edit);
router.post("/user/update/:id", multerUpload.single('profile_image'), userController.update);
router.get("/logout", userController.logout);
module.exports= router;