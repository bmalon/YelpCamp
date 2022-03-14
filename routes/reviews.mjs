import express from 'express';
import Review from '../models/review.mjs';
import Campground from '../models/campground.mjs';
import { validateReview } from '../middleware.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const ReviewRouter = express.Router({ mergeParams: true });

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
