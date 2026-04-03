const Joi = require("joi");

const noteSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    content: Joi.string().min(3).max(1000).required(),
    isImportant: Joi.boolean()

});

module.exports=noteSchema;


