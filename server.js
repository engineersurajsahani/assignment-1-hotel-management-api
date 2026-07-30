const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
app.use(express.json());

const requestLogger = (request, response, next) => {
    console.log("Request URL:- ", request.url, "Request Method:- ", request.method, "Date:- ", new Date().toLocaleString())
    next();
}
app.use(requestLogger);
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find((u) => u.username == username);
    if (!user) {
        return done(null, false);
    }
    if (user.password != password) {
        return done(null, false);
    }
    return done(null, user);
}));
app.use(passport.initialize());
const isAuthenticated = passport.authenticate('local', { 'session': false });

let hotels = [];
let users = [];


app.post("/login", isAuthenticated, (request, response) => {
    response.status(200).json({ message: "login successfull", user: request.user });
});
app.post("/register", (request, response) => {
    try {
        const newUser = {
            id: users.length + 1,
            name: request.body.name,
            username: request.body.username,
            email: request.body.email,
            password: request.body.password
        };
        users.push(newUser);
        response.status(200).json({ message: "User created successfully!!!" });
    } catch (error) {
        response.status(500).json(error);

    }
});
app.get("/", (request, response) => {
    try {
        response.status(200).json({ message: "Welcome to hotels API" });

    } catch (error) {
        response.status(500).json(error);
    }
});

app.get("/hotels", (request, response) => {
    try {
        response.status(200).json(hotels);
    } catch (error) {
        response.status(500).json(error);
    }
});
app.get("/hotels/:id", (request, response) => {
    try {
        const hotel = hotels.find((c) => c.id == request.params.id);
        if (!hotel) {
            return response.status(404).json({ message: "College not found!" });

        } else {
            response.status(200).json(hotel);
        }

    } catch (error) {
        response.status(500).json(error);

    }
})

app.post("/hotels", isAuthenticated, (request, response) => {
    try {
        const hotel = {
            id: hotels.length + 1,
            name: request.body.name,
            location: request.body.location,
            rating: request.body.rating,
            pricepernight: request.body.pricepernight
        }
        hotels.push(hotel);
        response.status(200).json({ message: "Congratulations you have added the hote;" });
    } catch (error) {
        response.status(500).json(error);
    }
});
app.put("/hotels/:id", isAuthenticated, (request, response) => {
    try {
        let hotel = hotels.find((c) => c.id == request.params.id);
        if (!hotel) {
            return response.status(404).json({ message: "Hotels not found" });
        } else {
            hotel.name = request.body.name;
            hotel.location = request.body.location;
            hotel.rating = request.body.rating;
            hotel.pricepernight = request.body.pricepernight;
            response.status(200).json({ message: "hotel updated successfully" })
        }
    } catch (error) {
        response.status(500).json(error);
    }
});

app.delete("/hotels/:id", isAuthenticated, (request, response) => {
    try {
        let hotelIndex = hotels.find((c) => c.id == request.params.id);
        if (hotelIndex == -1) {
            return response.status(404).json({ message: "hotel not found!!" })
        } else {
            hotels.splice(hotelIndex, 1);
            response.status(200).json({ message: "hotel deleted successfully" });
        }
    } catch (error) {
        response.status(500).json(error);
    }
})

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});