import express from 'express';
import mongoose from 'mongoose';
import ejsMate from 'ejs-mate';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import methodOverride from 'method-override';
import Joi from 'joi';
import CampgroundModel from './models/campground.mjs';
import ExpressError from './utils/ExpressError.mjs';
import catchAsync from './utils/catchAsync.mjs';

// const engine = require('ejs-mate');
const filename = fileURLToPath(import.meta.url);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
  // NOTE: useNewUrlParser, useUnifiedTopology, and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if they are true.
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', join(dirname(filename), 'views'));

app.engine('ejs', ejsMate);

// Middleware functions
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('common'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds', catchAsync(async (req, res) => {
  const campgrounds = await CampgroundModel.find({});
  res.render('campgrounds/index', { campgrounds });
}));

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', catchAsync(async (req, res) => {
  // if (!req.body.campground) throw new ExpressError(400, 'Invalid Campground Data');
  const campgroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.string().required(),
      location: Joi.string().required(),
      description: Joi.string().required(),
    }).required(),
  });
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(400, msg);
  }
  // console.log(result);
  const campground = new CampgroundModel(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const campground = await CampgroundModel.findById(req.params.id);
  res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const campground = await CampgroundModel.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await CampgroundModel.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await CampgroundModel.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));

app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

// app.get('/makecampground', async (req, res) => {
//   const camp = new CampgroundModel({
//     title: 'My Camp',
//     description: 'Amazing camping',
//   });
//   await camp.save();
//   res.send(camp);
// });

// Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  // eslint-disable-next-line no-param-reassign
  if (!err.message) err.message = 'Something went wrong';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('Serving on port 3000');
});
