import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import ejsMate from 'ejs-mate';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import methodOverride from 'method-override';
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.mjs';
import UserRouter from './routes/users.mjs';
import CampgroundRouter from './routes/campgrounds.mjs';
import ReviewRouter from './routes/reviews.mjs';
import ExpressError from './utils/ExpressError.mjs';

if (process.env.NODE_ENV !== 'production') {
  console.log(process.env.CLOUDINARY_CLOUD_NAME);
  console.log(process.env.CLOUDINARY_KEY);
  console.log(process.env.CLOUDINARY_SECRET);
}

// const engine = require('ejs-mate');
const filename = fileURLToPath(import.meta.url);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
  // NOTE: useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if they are true.
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

const sessionConfig = {
  secret: 'badsecretvalue',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// Middleware functions
app.use(express.static(join(dirname(filename), 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('common'));
app.use(flash());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', UserRouter);
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
