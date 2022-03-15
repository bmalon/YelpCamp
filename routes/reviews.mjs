import express from 'express';
import { validateReview, isLoggedIn, isReviewAuthor } from '../middleware.mjs';
import * as ReviewsController from '../controllers/reviews.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const ReviewRouter = express.Router({ mergeParams: true });

ReviewRouter.post('/', isLoggedIn, validateReview, catchAsync(ReviewsController.createReview));

ReviewRouter.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(ReviewsController.deleteReview));

export default ReviewRouter;
