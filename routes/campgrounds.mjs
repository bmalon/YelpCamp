import express from 'express';
import multer from 'multer';
import { storage } from '../cloudinary/index.mjs';
import { validateCampground, isLoggedIn, isAuthor } from '../middleware.mjs';
import * as CampgroundsController from '../controllers/campgrounds.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const upload = multer({ storage });
const CampgroundRouter = express.Router();

CampgroundRouter.route('/')
  .get(catchAsync(CampgroundsController.index))
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(CampgroundsController.createCampground));
//   .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('YES');
//   });

CampgroundRouter.get('/new', isLoggedIn, CampgroundsController.renderNewForm);

CampgroundRouter.route('/:id')
  .get(catchAsync(CampgroundsController.showCampground))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(CampgroundsController.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(CampgroundsController.deleteCampground));

CampgroundRouter.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(CampgroundsController.renderEditForm));

export default CampgroundRouter;
