// joi middleware for db validations >>
const {noteSchema} = require("./schema.js");
const {userSchema}=require("./schema.js");
const jwt = require("jsonwebtoken");

const ExpressError=require("./utils/expressError.js");

function validateNote(req,res,next){
    const result = noteSchema.validate(req.body);
    let {error}=result;
    if(error){
        const msg = error.details.map((el)=>el.message).join(",");

        return next(new ExpressError(400,msg));
    }
    next();

}


function validateUser(req,res,next){
    const result2 = userSchema.validate(req.body);
    let {error} = result2;
    if(error){

        let msg = error.details.map((el)=>el.message).join(",");


        return next(new ExpressError(400,msg));
    }
    next();
    
}



function isAuthenticated(req, res, next) {
    const accessToken = req?.cookies?.accessToken;
    if (!accessToken) {
        return res.redirect("/users/signup");
    }
    
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; // attaching decoded user to request
        next();
    } catch (err) {
        return res.redirect("/users/signup");
    }
}

function checkUser(req, res, next) {
    const accessToken = req?.cookies?.accessToken;
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;
            res.locals.currUser = decoded;
        } catch (err) {
            req.user = null;
            res.locals.currUser = null;
        }
    } else {
        req.user = null;
        res.locals.currUser = null;
    }
    next();
}

module.exports = {validateNote,validateUser,isAuthenticated,checkUser};

