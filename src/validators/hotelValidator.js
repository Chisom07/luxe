const Joi = require("joi");

exports.hotelSchema = Joi.object({
    cityCode: Joi.string().length(3).required(),
    checkIn: Joi.date().required(),
    checkOut: Joi.date().required()
});