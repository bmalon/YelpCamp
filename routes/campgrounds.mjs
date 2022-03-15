import express from 'express';
import { validateCampground, isLoggedIn, isAuthor } from '../middleware.mjs';
import * as CampgroundsController from '../controllers/campgrounds.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const CampgroundRouter = express.Router();

CampgroundRouter.route('/')
  .get(catchAsync(CampgroundsController.index))
  .post(isLoggedIn, validateCampground, catchAsync(CampgroundsController.createCampground));

CampgroundRouter.get('/new', isLoggedIn, CampgroundsController.renderNewForm);

CampgroundRouter.route('/:id')
  .get(catchAsync(CampgroundsController.showCampground))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(CampgroundsController.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(CampgroundsController.deleteCampground));

CampgroundRouter.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(CampgroundsController.renderEditForm));

export default CampgroundRouter;
