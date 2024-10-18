const express = require("express");
const userrouter = express.Router();
const controllers = require("../controllers/controllers");

userrouter
  .get("/", controllers.getindex)
  .get("/login", controllers.getlogin)
  .get("/signup", controllers.getsignup)
  .get("/contact", controllers.getcontact)
  .get("/logout", controllers.logout)
  .get("/categories/:categoryId", controllers.getcategories)
  .get("/single/:productId", controllers.getsingle);

userrouter
  .post("/login", controllers.postlogin)
  .post("/signup", controllers.postsignup);

module.exports = userrouter;
