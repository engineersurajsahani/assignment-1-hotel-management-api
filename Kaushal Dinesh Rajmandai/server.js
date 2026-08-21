const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');

const app = express();

app.use(express.json());

app.use(session({
    secret: 'hotel-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Welcome to Hotel APIs');
});

app.use('/', authRoutes);
app.use('/hotels', hotelRoutes);

app.listen(4001, () => {
    console.log("Hotel API server running on port 4001");
});