const Joi = require("joi");

const noteSchema = Joi.object({
  title: Joi.string().min(3).max(300).required(),
  content: Joi.string().min(3).max(5000).required(),
  isImportant: Joi.boolean()

});
//ye humen sirf validatons lagaye >> agar ye validations hue achese to thik verna for handling these error middleware.js me he >> main cheez for handling all errors regarding validarion errrors>
// module.exports=noteSchema;


const userSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
    }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } })
    .lowercase()
    .required(),

  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .lowercase()
    .required(),

  password: Joi.string()
    .min(5)
    .required()
    .messages({
      'string.min': 'Password must be at least 5 characters long',
    }),

  refreshToken: Joi.string()
    .optional(),

});

module.exports = { noteSchema, userSchema };
