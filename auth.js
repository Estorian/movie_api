const jwtSecret = 'your_jwt_secret'; //This must be the same key used in the JWTStrategy.

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');

let generateJWTToken = user => {
  return jwt.sign(user,jwtSecret, {
    subject: user.username, //This is the username you're encoding into the JWT
    expiresIn: '7d', //This is the time limit set for how long it will be till the token expires.
    algorithm: 'HS256' // This is the algorithm used to sign or encode the values of the JWT.
  });
}

// POST login.
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', {session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is messed up',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}
