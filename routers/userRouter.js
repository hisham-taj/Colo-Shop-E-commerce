const express = require("express");
const userrouter = express.Router();
const controllers = require("../controllers/controllers");

userrouter
  .get("/", controllers.getindex)
  .get("/login", controllers.getlogin)
  .get("/signup", controllers.getsignup)
  .get("/contact", controllers.getcontact)
  .get("/logout", controllers.logout)
  .get("/categories", controllers.getcategories)
  .get("/single", controllers.getsingle);

userrouter
  .post("/login", controllers.postlogin)
  .post("/signup", controllers.postsignup);

module.exports = userrouter;
