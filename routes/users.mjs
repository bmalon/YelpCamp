import express from 'express';
import passport from 'passport';
import * as UsersController from '../controllers/users.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const UserRouter = express.Router();

UserRouter.route('/register')
  .get(UsersController.renderRegisterForm)
  .post(catchAsync(UsersController.register));

UserRouter.route('/login')
  .get(UsersController.renderLoginForm)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), UsersController.login);

UserRouter.get('/logout', UsersController.logout);

export default UserRouter;
