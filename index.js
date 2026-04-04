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
const { isAuthenticated } = require("./middleware.js");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");




app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));     //for parsing the data cmong from form
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use("/notes", isAuthenticated, notesRouter); // router ka middleware >>
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


// app.get("/",(req,res)=>{
//     console.log("working");
//     res.send("url is localhost:3000/notes bi*ch");
// })

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