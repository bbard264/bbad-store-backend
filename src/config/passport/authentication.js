const passport = require('passport');

const authentication = (req, res, next) => {
  console.log('Authenticating request...');
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return next(err);
    }

    if (!user) {
      console.log('Authentication failed:', info.message);
      return res.status(401).json({ message: info.message });
    }

    console.log(
      'Authentication successful. user_id:',
      user._id,
      'user_name:',
      user.displayname
    );
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = authentication;
