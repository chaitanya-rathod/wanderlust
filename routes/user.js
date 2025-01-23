const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { signup } = require("../controllers/users");
const userController=require("../controllers/users.js");

// router.get("/signup", (req, res) => {
//     res.render("users/signup");
// });

router.route("/signup")
.get( (req, res) => {
    res.render("users/signup");
})
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login);

// router.get("/login", userController.renderLoginForm);

// router.get("/login",userController.renderSignupForm);

// router.post("/login",passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login);

router.get("/logout",userController.logout);

module.exports = router;