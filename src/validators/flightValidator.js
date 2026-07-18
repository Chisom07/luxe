const Joi = require("joi");

exports.flightSchema = Joi.object({
  from: Joi.string().min(2).max(60).required(),
  to: Joi.string().min(2).max(60).required(),
  date: Joi.date().required(),
  passengers: Joi.number().min(1).max(10).default(1),
  sortBy: Joi.string().valid("price", "duration", "").optional(),
  stops: Joi.alternatives().try(Joi.number().integer().min(0).max(2), Joi.string().allow("")).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});
