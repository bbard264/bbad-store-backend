const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../../models/user');

const option = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'bbad',
};

const JWTStrategy = new Strategy(option, async (payload, done) => {
  const targetUser = await User.getUserById(payload.id);
  if (targetUser) {
    done(null, targetUser);
  } else {
    done(null, false);
  }
});

passport.use('jwt', JWTStrategy);
