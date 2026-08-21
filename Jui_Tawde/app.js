const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const PORT = 3000;

/* ===============================
   In-Memory Storage
================================= */

const users = [];
const hotels = [];

let userIdCounter = 1;
let hotelIdCounter = 1;

/* ===============================
   Middleware
================================= */

app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
    console.log(
        `[${new Date().toLocaleString()}] ${req.method} ${req.url}`
    );
    next();
});

// Session
app.use(
    session({
        secret: "hotel_secret",
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

/* ===============================
   Passport Local Strategy
================================= */

passport.use(
    new LocalStrategy(async (username, password, done) => {

        const user = users.find(
            u => u.username === username
        );

        if (!user)
            return done(null, false, { message: "Invalid Username" });

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match)
            return done(null, false, { message: "Invalid Password" });

        return done(null, user);

    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {

    const user = users.find(
        u => u.id === id
    );

    done(null, user);
});

/* ===============================
   Authentication Middleware
================================= */

function isAuthenticated(req, res, next) {

    if (req.isAuthenticated())
        return next();

    return res.status(401).json({
        success: false,
        message: "Please login first."
    });

}

/* ===============================
   Welcome Route
================================= */

app.get("/", (req, res) => {

    res.send("Welcome to Hotel APIs");

});

/* ===============================
   Register
================================= */

app.post("/register", async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password)
        return res.status(400).json({
            message: "All fields are required"
        });

    const exists = users.find(
        u =>
            u.username === username ||
            u.email === email
    );

    if (exists)
        return res.status(409).json({
            message: "Username or Email already exists"
        });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {

        id: userIdCounter++,
        username,
        email,
        password: hashedPassword

    };

    users.push(newUser);

    res.status(201).json({
        message: "Registration Successful",
        user: {
            id: newUser.id,
            username,
            email
        }
    });

});

/* ===============================
   Login
================================= */

app.post("/login", (req, res, next) => {

    passport.authenticate(
        "local",
        (err, user, info) => {

            if (err)
                return next(err);

            if (!user)
                return res.status(401).json(info);

            req.login(user, err => {

                if (err)
                    return next(err);

                return res.json({
                    message: "Login Successful"
                });

            });

        }
    )(req, res, next);

});

/* ===============================
   Hotels
================================= */

// Get All Hotels

app.get("/hotels", (req, res) => {

    res.json(hotels);

});

// Get Hotel by ID

app.get("/hotels/:id", (req, res) => {

    const hotel = hotels.find(
        h => h.id == req.params.id
    );

    if (!hotel)
        return res.status(404).json({
            message: "Hotel not found"
        });

    res.json(hotel);

});

// Add Hotel

app.post("/hotels", isAuthenticated, (req, res) => {

    const {
        name,
        location,
        rating,
        pricePerNight
    } = req.body;

    if (
        !name ||
        !location ||
        rating == null ||
        pricePerNight == null
    )
        return res.status(400).json({
            message: "Fill all fields"
        });

    if (rating < 1 || rating > 5)
        return res.status(400).json({
            message: "Rating must be between 1 and 5"
        });

    if (pricePerNight <= 0)
        return res.status(400).json({
            message: "Price must be greater than 0"
        });

    const hotel = {

        id: hotelIdCounter++,
        name,
        location,
        rating,
        pricePerNight

    };

    hotels.push(hotel);

    res.status(201).json({
        message: "Hotel Added",
        hotel
    });

});

// Update Hotel

app.put("/hotels/:id", isAuthenticated, (req, res) => {

    const hotel = hotels.find(
        h => h.id == req.params.id
    );

    if (!hotel)
        return res.status(404).json({
            message: "Hotel not found"
        });

    Object.assign(hotel, req.body);

    res.json({
        message: "Hotel Updated",
        hotel
    });

});

// Delete Hotel

app.delete("/hotels/:id", isAuthenticated, (req, res) => {

    const index = hotels.findIndex(
        h => h.id == req.params.id
    );

    if (index == -1)
        return res.status(404).json({
            message: "Hotel not found"
        });

    hotels.splice(index, 1);

    res.json({
        message: "Hotel Deleted"
    });

});

/* ===============================
   Start Server
================================= */

app.listen(PORT, () => {

    console.log(`Server Running at http://localhost:${PORT}`);

});