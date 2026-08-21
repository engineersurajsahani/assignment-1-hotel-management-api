const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { users } = require('../data/store');

passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) {
        return done(null, false, { message: 'Incorrect username' });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

module.exports = passport;