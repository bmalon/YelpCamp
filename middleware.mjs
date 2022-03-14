const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Store path requested by user for post-login use
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in');
    return res.redirect('/login');
  }
  return next();
};

export default isLoggedIn;
