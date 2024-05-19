const Joi = require("joi");

module.exports.listingSchema = Joi.object(
    {
        listing : Joi.object(
            {
            
            title: Joi.string().min(3).max(30).required(),
            description: Joi.string().alphanum().min(10).max(200).required(),
            image: Joi.string().allow("",null),
            country: Joi.string().required(),
            location: Joi.string().required(),
            price: Joi.number().required().min(0)
        }
    ).required()
    }
)