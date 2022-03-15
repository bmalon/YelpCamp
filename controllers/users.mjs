import User from '../models/user.mjs';

const renderRegisterForm = (req, res) => {
  res.render('users/register');
};

const renderLoginForm = (req, res) => {
  res.render('users/login');
};

const register = async (req, res, next) => {
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
};

const login = (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectURL = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo; // clean up
  res.redirect(redirectURL);
};

const logout = (req, res) => {
  req.logout();
  req.flash('success', 'Signed out successfully');
  res.redirect('/campgrounds');
};

export {
  renderRegisterForm,
  renderLoginForm,
  register,
  login,
  logout,
};
