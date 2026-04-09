// joi middleware for db validations >>
const {noteSchema} = require("./schema.js");
const {userSchema}=require("./schema.js");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
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

const globalRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
     message: "Too many requests, try again later",
});


const strictRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
    limit: 20,                         //strict he issliye only 20 req in 15 min >>
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
     message: "Too many requests, try again later",
});


module.exports = {validateNote,validateUser,isAuthenticated,checkUser,globalRateLimiter,strictRateLimiter};

