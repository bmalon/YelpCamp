import Router from 'express';
import Campground from '../models/campground.mjs';
import { CampgroundSchema } from '../schemas.mjs';
import ExpressError from '../utils/ExpressError.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const CampgroundRouter = Router();

const validateCampground = (req, res, next) => {
  const { error } = CampgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(', '); // create a single error message string
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

CampgroundRouter.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));

CampgroundRouter.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

CampgroundRouter.post('/', validateCampground, catchAsync(async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  req.flash('success', 'Successfully created a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

CampgroundRouter.get('/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
  if (!campground) {
    req.flash('error', 'Campground does not exist!');
    res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
}));

CampgroundRouter.get('/:id/edit', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'Campground does not exist!');
    res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}));

CampgroundRouter.put('/:id', validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', 'Successfully updated the campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

CampgroundRouter.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted your campground!');
  res.redirect('/campgrounds');
}));

export default CampgroundRouter;
