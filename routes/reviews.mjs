import express from 'express';
import Review from '../models/review.mjs';
import Campground from '../models/campground.mjs';
import { ReviewSchema } from '../schemas.mjs';
import ExpressError from '../utils/ExpressError.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const ReviewRouter = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = ReviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(', '); // create a single error message string
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

ReviewRouter.post('/', validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Successfully created a new review!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

ReviewRouter.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted your review!');
  res.redirect(`/campgrounds/${id}`);
}));

export default ReviewRouter;
