import express from 'express';
import mongoose from 'mongoose';
import ejsMate from 'ejs-mate';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import methodOverride from 'method-override';
import CampgroundRouter from './routes/campgrounds.mjs';
import ReviewRouter from './routes/reviews.mjs';
import ExpressError from './utils/ExpressError.mjs';

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

app.use('/campgrounds', CampgroundRouter);
app.use('/campgrounds/:id/reviews', ReviewRouter);

app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

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
