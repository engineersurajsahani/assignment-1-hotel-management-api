const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());

const requireLogger = (request, response, next) => {
    console.log("Request URL", request.url);
    console.log("Request Method", request.method);
    console.log("Date", new Date().toLocaleString());
    next();
};

app.use(requireLogger);

let hotels = [];
let users = [];

passport.use(
    new LocalStrategy(async (username, password, done) => {
        const user = users.find((u) => u.username == username);
        
        if (!user) {
            return done(null, false, { message: "Incorrect User" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: "Incorrect Password" });
        }
        
        return done(null, user);
    })
);

app.use(passport.initialize());

const isAuthenticated = passport.authenticate('local', {
    session: false
});

app.get("/", (request, response) => {
    response.status(200).send("Welcome to Hotel APIs");
});

app.post("/register", async (request, response) => {
    try {
        const { username, email, password } = request.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: users.length + 1,
            username: username,
            email: email,
            password: hashedPassword,
        };

        users.push(newUser);

        response.status(201).json({
            message: "The user has registered Successfully!!!"
        });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

app.post("/login", isAuthenticated, (request, response) => {
    response.status(200).json({
        message: "Login successful!"
    });
});

app.get("/hotels", (request, response) => {
    try {
        const { rating } = request.query;

        if (rating) {
            const filteredHotels = hotels.filter(h => h.rating == rating);
            return response.status(200).json(filteredHotels);
        }

        response.status(200).json(hotels);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

app.get("/hotels/:id", (request, response) => {
    try {
        const hotel = hotels.find((h) => h.id == request.params.id);

        if (!hotel) {
            return response.status(404).json({ message: "Hotel Not Found" });
        }

        response.status(200).json(hotel);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

app.post("/hotels", isAuthenticated, (request, response) => {
    try {
        const { name, location, rating, pricePerNight } = request.body;

        const hotelExists = hotels.find((h) => h.name.toLowerCase() === name.toLowerCase());
        if (hotelExists) {
            return response.status(400).json({ message: "A hotel with this name exists." });
        }

        const newHotel = {
            id: hotels.length + 1,
            name,
            location,
            rating,
            pricePerNight
        };

        hotels.push(newHotel);

        response.status(201).json({
            message: "Hotel Added Successfully!!",
            hotel: newHotel
        });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

app.put("/hotels/:id", isAuthenticated, (request, response) => {
    try {
        let hotel = hotels.find((h) => h.id == request.params.id);

        if (!hotel) {
            return response.status(404).json({ message: "Hotel Not Found" });
        }

        const { name, location, rating, pricePerNight } = request.body;

        if (name) {
            const nameExists = hotels.find((h) => h.name.toLowerCase() === name.toLowerCase() && h.id != request.params.id);
            if (nameExists) {
                return response.status(400).json({ message: "Another hotel with this name already exists." });
            }
            hotel.name = name;
        }
        if (location) hotel.location = location;
        if (rating) hotel.rating = rating;
        if (pricePerNight) hotel.pricePerNight = pricePerNight;

        response.status(200).json({
            message: "Hotel Updated Successfully!!!",
            hotel
        });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

app.delete("/hotels/:id", isAuthenticated, (request, response) => {
    try {
        const hotelIndex = hotels.findIndex((h) => h.id == request.params.id);
        if (hotelIndex == -1) {
            return response.status(404).json({ message: "Hotel not found" });
        }

        hotels.splice(hotelIndex, 1);

        response.status(200).json({
            message: "Hotel Deleted Successfully"
        });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});