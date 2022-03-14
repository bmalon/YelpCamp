import Campground from './models/campground.mjs';
import Review from './models/review.mjs';
import { CampgroundSchema, ReviewSchema } from './schemas.mjs';
import ExpressError from './utils/ExpressError.mjs';

const validateCampground = (req, res, next) => {
  const { error } = CampgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(', '); // create a single error message string
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = ReviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(', '); // create a single error message string
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Store path requested by user for post-login use
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in');
    return res.redirect('/login');
  }
  return next();
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do this');
    return res.redirect(`/campgrounds/${id}`);
  }
  return next();
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do this');
    return res.redirect(`/campgrounds/${id}`);
  }
  return next();
};

export {
  validateCampground,
  validateReview,
  isLoggedIn,
  isAuthor,
  isReviewAuthor,
};
