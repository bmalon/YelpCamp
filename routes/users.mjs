import express from 'express';
import passport from 'passport';
import User from '../models/user.mjs';
// import { UserSchema } from '../schemas.mjs';
// import ExpressError from '../utils/ExpressError.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const UserRouter = express.Router();

UserRouter.get('/register', (req, res) => {
  res.render('users/register');
});

UserRouter.post('/register', catchAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) next(err);
      req.flash('success', 'Welcome to YelpCamp!');
      res.redirect('/campgrounds');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
}));

UserRouter.get('/login', (req, res) => {
  res.render('users/login');
});

UserRouter.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectURL = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo; // clean up
  res.redirect(redirectURL);
});

UserRouter.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Signed out successfully');
  res.redirect('/campgrounds');
});

export default UserRouter;
