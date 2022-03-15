import express from 'express';
import { validateCampground, isLoggedIn, isAuthor } from '../middleware.mjs';
// import { campgroundsIndex, renderNewCampgroundForm } from '../controllers/campgrounds.mjs';
import * as CampgroundsController from '../controllers/campgrounds.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const CampgroundRouter = express.Router();

CampgroundRouter.get('/', catchAsync(CampgroundsController.index));

CampgroundRouter.get('/new', isLoggedIn, CampgroundsController.renderNewForm);

CampgroundRouter.post('/', isLoggedIn, validateCampground, catchAsync(CampgroundsController.createCampground));

CampgroundRouter.get('/:id', catchAsync(CampgroundsController.showCampground));

CampgroundRouter.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(CampgroundsController.renderEditForm));

CampgroundRouter.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(CampgroundsController.updateCampground));

CampgroundRouter.delete('/:id', isLoggedIn, isAuthor, catchAsync(CampgroundsController.deleteCampground));

export default CampgroundRouter;
