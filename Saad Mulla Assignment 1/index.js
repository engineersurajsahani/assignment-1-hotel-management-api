const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

app.use(express.json());


const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
    next();
};
app.use(requestLogger);


let hotels = [];
let users = [];


passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
    }

\
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
}));

app.use(passport.initialize());


app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to Hotel APIs" });
});


app.post('/register', (req, res) => {
    try {
        const { username, email, password } = req.body;


        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists!" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10); 

        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword 
        };

        users.push(newUser);
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user!" });
    }
});


app.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "Something went wrong!" });
        }
        if (!user) {
           
            return res.status(401).json({ message: info.message });
        }

      
        return res.status(200).json({ message: "Login successful!", user: { id: user.id, username: user.username } });
    })(req, res, next);
});


app.get('/hotels', (req, res) => {
    const { rating } = req.query;

    if (rating) {
        const filtered = hotels.filter(h => h.rating == rating);
        return res.status(200).json(filtered);
    }

    res.status(200).json(hotels);
});


app.get('/hotels/:id', (req, res) => {
    const hotel = hotels.find(h => h.id == req.params.id);

    if (!hotel) {
        return res.status(404).json({ message: "Hotel not found!" });
    }

    res.status(200).json(hotel);
});


app.post('/hotels', (req, res) => {
    const { name, location, rating, pricePerNight } = req.body;

    const duplicate = hotels.find(h => h.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
        return res.status(400).json({ message: "Hotel with this name already exists!" });
    }

    const newHotel = {
        id: hotels.length + 1,
        name,
        location,
        rating,
        pricePerNight
    };

    hotels.push(newHotel);
    res.status(201).json({ message: "Hotel added successfully!" });
});


app.put('/hotels/:id', (req, res) => {
    const hotel = hotels.find(h => h.id == req.params.id);

    if (!hotel) {
        return res.status(404).json({ message: "Hotel not found!" });
    }

    hotel.name = req.body.name;
    hotel.location = req.body.location;
    hotel.rating = req.body.rating;
    hotel.pricePerNight = req.body.pricePerNight;

    res.status(200).json({ message: "Hotel updated successfully!" });
});


app.delete('/hotels/:id', (req, res) => {
    const index = hotels.findIndex(h => h.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Hotel not found!" });
    }

    hotels.splice(index, 1);
    res.status(200).json({ message: "Hotel deleted successfully!" });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});