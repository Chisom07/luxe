const Joi = require("joi");

exports.hotelSchema = Joi.object({
  cityCode: Joi.string().min(2).max(60).required(),
  checkIn: Joi.date().required(),
  checkOut: Joi.date().required(),
  passengers: Joi.number().min(1).max(10).optional(),
  sortBy: Joi.string().valid("price", "rating", "").optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});
