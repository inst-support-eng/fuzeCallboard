const passport = require("passport");
const GoogleStrategey = require("passport-google-oauth20");
const mongoose = require("mongoose");
require("dotenv").config();

const User = mongoose.model("users");

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_CLIENT = process.env.GOOGLE_CLIENT;

//deals with cookies
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// more cookies
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategey(
    {
      clientID: GOOGLE_ID,
      clientSecret: GOOGLE_CLIENT,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      // grab profile from user accessing
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          // already a user in mongo
          done(null, existingUser);
        } else {
          // need new record - create in mongo
          new User({ googleId: profile.id })
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);
