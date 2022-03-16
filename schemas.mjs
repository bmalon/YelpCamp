import Joi from 'joi';

const CampgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

const ReviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  }).required(),
});

export {
  CampgroundSchema,
  ReviewSchema,
};
