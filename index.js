//firstly setting up everything
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config();

const notesRouter = require("./routes/notes.js");
const userRouter = require("./routes/user.js");

const methodOverride = require("method-override");
const ExpressError = require("./utils/expressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const cookieParser = require("cookie-parser");
const {globalRateLimiter, isAuthenticated, checkUser } = require("./middleware.js");

const rateLimit = require("express-rate-limit");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");




app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));     //for parsing the data cmong from form
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(checkUser);

app.set('trust proxy', 1);

app.use(globalRateLimiter);    //we are passsing it gloabally for all 

app.use("/notes", notesRouter);
app.use("/users", userRouter);



async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/notes');
}

main()
    .then(() => {
        console.log("connection suceesful");
    })
    .catch((err) => {
        console.log(`error is ${err}`)
    })


app.get("/",(req,res)=>{
    res.redirect("/notes");
})

app.use((req, res, next) => {
    next(new ExpressError(404, "page not found "));

})


app.use((err, req, res, next) => {
    let { status, message } = err;
    res.render("error.ejs", { status, message });
})



const port = 3000;
app.listen(port, () => {
    console.log("server is listening at port no 3000");
})