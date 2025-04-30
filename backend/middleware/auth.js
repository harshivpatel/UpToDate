function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // User is logged in
  } else {
    return res.status(401).send('Unauthorized: Please log in first');
  }
}

