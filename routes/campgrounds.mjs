import express from 'express';
import Campground from '../models/campground.mjs';
import { validateCampground, isLoggedIn, isAuthor } from '../middleware.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const CampgroundRouter = express.Router();

CampgroundRouter.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));

CampgroundRouter.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

CampgroundRouter.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully created a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

CampgroundRouter.get('/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
  console.log(campground);
  if (!campground) {
    req.flash('error', 'Campground does not exist!');
    res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
}));

CampgroundRouter.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Campground does not exist!');
    return res.redirect('/campgrounds');
  }
  return res.render('campgrounds/edit', { campground });
}));

CampgroundRouter.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', 'Successfully updated the campground!');
  return res.redirect(`/campgrounds/${campground._id}`);
}));

CampgroundRouter.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted your campground!');
  res.redirect('/campgrounds');
}));

export default CampgroundRouter;
