const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { validateUser } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("signup.ejs");
})

router.post("/signUp", validateUser, wrapAsync(async (req, res, next) => {
    try {
        let { name, email, username, password } = req.body;
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        })
        await newUser.save();

        res.redirect("/users/login");
        //sign up karne ke baad user should firstly log in tab hi toh uske tokens banege >> its mandatory 
    } catch (err) {
        if (err.code === 11000) {
            return next(new ExpressError(400, "That username or email is already taken. Please try another one."));
        }
        next(err);
    }
}))



router.get("/login", (req, res) => {
    res.render("login.ejs");

})

router.post("/logIn", wrapAsync(async (req, res) => {
    let { username, password } = req.body;
    let user = await User.findOne({ username });
    //jer user sapadla nahi ter >
    if (!user) {
        return res.render("login.ejs", { error: "Invalid username or password" });

    }

    const isPasswordvalid = await user.isPasswordCorrect(password);  //req.body se nikala password>>  this function gives true or false values like valid he ki nahi >

    if (!isPasswordvalid) {
        return res.render("login.ejs", { error: "Invalid username or password" });
    }

    //now agar password sahi he it means user is gonna succesfully loging in abhi yaha pe we have to generate access token and refresh token 

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    //saving refresh tokens 
    user.refreshToken = refreshToken;    //user bascially wo jo documnet he usme save kar diya ye apna naya field >> wasie bhi db me hume ye field rakhi thi hi


    await user.save({ validateBeforeSave: false });   // validatebeforesave:false matlab jab ye refreshtoken save hoga toh dusre sare fields bhi to auto save ya aisa kuch conflict hoga na toh iss liye ye bolta he uss save ke liye validations off rakho

    //last me inn tokens ko cookie me bhej do 
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.redirect("/notes");

}))

router.get("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.redirect("/notes");
});



module.exports = router;
