const Joi = require("joi");

exports.flightSchema = Joi.object({
    from: Joi.string().length(3).required(),
    to: Joi.string().length(3).required(),
    date: Joi.date().required(),
    passengers: Joi.number().min(1).max(10).default(1)
});