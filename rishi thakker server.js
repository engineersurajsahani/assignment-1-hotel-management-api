const express= require("express");
const passport= require("passport");
const LocalStrategy= require("passport-local").Strategy;
const bcrypt= require("bcryptjs");

const app= express();
app.use(express.json());

const requestLogger= (request, response, next)=>{
    console.log("Request URL: ", request.url);
    console.log("Request Method: ", request.method);
    console.log("Date: ", new Date().toLocaleString());
    next();
};
app.use(requestLogger);
app.use(passport.initialize());

let hotels = [];
let users = [];

passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) {
        return done(null, false, { message: 'User not found' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
    });
}));

app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    res.status(200).json({
        message: "Login successful!",
        user: { id: req.user.id, username: req.user.username, email: req.user.email }
    });
});

const isAuthenticated = passport.authenticate('local', { session: false });

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "username, email and password are required" });
        }

        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword
        };

        users.push(newUser);
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get('/', (req, res) => {
    res.status(200).send('Welcome to Hotel APIs');
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

app.post('/hotels',(req, res) => {
    const { name, location, rating, pricePerNight } = req.body;

    if (!name || !location || rating == null || pricePerNight == null) {
        return res.status(400).json({ message: "name, location, rating and pricePerNight are required" });
    }

    const duplicate = hotels.find(h => h.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
        return res.status(400).json({ message: "A hotel with this name already exists!" });
    }

    const newHotel = {
        id: hotels.length + 1,
        name,
        location,
        rating,
        pricePerNight
    };

    hotels.push(newHotel);
    res.status(201).json({ message: "Hotel added successfully!", hotel: newHotel });
});

app.put('/hotels/:id', (req, res) => {
    const hotel = hotels.find(h => h.id == req.params.id);

    if (!hotel) {
        return res.status(404).json({ message: "Hotel not found!" });
    }

    const { name, location, rating, pricePerNight } = req.body;

    if (name) hotel.name = name;
    if (location) hotel.location = location;
    if (rating != null) hotel.rating = rating;
    if (pricePerNight != null) hotel.pricePerNight = pricePerNight;

    res.status(200).json({ message: "Hotel updated successfully!", hotel });
});

app.delete('/hotels/:id', (req, res) => {
    const index = hotels.findIndex(h => h.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Hotel not found!" });
    }

    hotels.splice(index, 1);
    res.status(200).json({ message: "Hotel deleted successfully!" });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
