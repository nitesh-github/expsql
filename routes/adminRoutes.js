const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const userController = require("../controllers/api/userController")
router.get('/', (req,res)=>{
    const data = {
      title:"Dashboard"
    }
    res.render("admin/home",data);
  });
  
  router.get('/login', (req,res)=>{
    const data = {
      title:"Admin Login Page"
    }
    res.render("admin/auth/login",data);
  });
router.use('/',authMiddleware);
module.exports= router;