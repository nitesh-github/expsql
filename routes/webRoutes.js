const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const adminRoutes = require("./adminRoutes");
router.get('/', (req,res)=>{
    const data = {
      title:"Home Page"
    }
    res.render("front/home",data);
  });
  router.use('/admin', adminRoutes);
module.exports= router;