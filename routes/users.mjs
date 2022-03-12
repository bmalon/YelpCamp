import express from 'express';
import User from '../models/user.mjs';
// import { UserSchema } from '../schemas.mjs';
// import ExpressError from '../utils/ExpressError.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const UserRouter = express.Router();

UserRouter.get('/register', (req, res) => {
  res.render('users/register');
});

UserRouter.post('/register', async (req, res) => {
  res.send(req.body);
});

export default UserRouter;
