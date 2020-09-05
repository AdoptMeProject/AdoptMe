// TODO
const passport = require("passport");
const User = require("../models/user.model");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const randomPassword = () => Math.random().toString(36).substring(7)

const google = new GoogleStrategy(
  {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
(accessToken, refreshToken, profile, next) => {
  console.log("Google account details:", profile);
  User.findOne({ "social.google": profile.id })
    .then(user => {
      if (user) {
        next(null, user);
      } else {
        const newUser = new User({
          name: profile.displayName,
          username: profile.displayName,
          email: profile._json.email,
          avatar: profile._json.picture,
          password:
            profile.provider + Math.random().toString(36).substring(7),
          social: {
            googleID: profile.id,
          },
        });
        newUser
        .save()
        .then((user) => {
          next(null, user);
        })
        .catch((err) => next(err));
    }
  })
  .catch((err) => next(err));
 }
);

passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
},
function(token, tokenSecret, profile, cb) {
  User.findOrCreate({ twitterId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

passport.serializeUser(function(user, next) {
  next(null, user);
});
passport.deserializeUser(function(user, next) {
  next(null, user);
});

passport.use(google)

module.exports = passport.initialize()