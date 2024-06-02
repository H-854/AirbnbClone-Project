const Joi = require("joi");
const Review = require("./models/review");

module.exports.listingSchema = Joi.object(
    {
        listing : Joi.object(
            {
            
            title: Joi.string().min(3).max(30).required(),
            description: Joi.string().min(10).max(200).required(),
            image: Joi.string().allow("",null),
            country: Joi.string().required(),
            location: Joi.string().required(),
            price: Joi.number().required().min(0)
        }
    )
    }
)

module.exports.reviewSchema = Joi.object(
    {
        review : Joi.object(
            {
                comment: Joi.string().min(1).max(500).required(),
                rating: Joi.number().required().min(0).max(5)
            }
        )
    }
)