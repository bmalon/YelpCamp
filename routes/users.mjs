import express from 'express';
import passport from 'passport';
import * as UsersController from '../controllers/users.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const UserRouter = express.Router();

UserRouter.get('/register', UsersController.renderRegisterForm);

UserRouter.post('/register', catchAsync(UsersController.register));

UserRouter.get('/login', UsersController.renderLoginForm);

UserRouter.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), UsersController.login);

UserRouter.get('/logout', UsersController.logout);

export default UserRouter;
