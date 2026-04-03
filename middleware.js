// joi middleware for db validations >>
const noteSchema= require("./schema.js");
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

module.exports = validateNote;
