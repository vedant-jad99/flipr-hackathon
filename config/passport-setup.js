const passport = require('passport');
const User = require('../models/user-google');
const GoogleStrategy = require('passport-google-oauth20').Strategy;



passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    })
});



passport.use(new GoogleStrategy({
        //options for google startegy
        callbackURL: "/google/redirect",
        clientID:"636439235774-e3kujgkmondkdi23q0pmf81ne1go15mr.apps.googleusercontent.com",
        clientSecret:"9xdVpeezE0UTbJ6neFAeG04h"
    },(accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    thumbnail : profile._json.picture
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);