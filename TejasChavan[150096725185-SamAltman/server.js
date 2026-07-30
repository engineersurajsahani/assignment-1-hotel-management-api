const express = require("express");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

app.use(express.json());

// Middleware
const requestLogger = (request, response, next) => {
    console.log(
        "Request URL :-", request.url,
        "Request Method :-", request.method,
        "Date :-", new Date().toLocaleString()
    );
    next(); // IMPORTANT
};

app.use(requestLogger);
passport.use(new LocalStrategy(
    {
        usernameField: "username",
        passwordField: "password",
    },
    (username, password, done) => {
        const user = users.find(
            (u) => u.username === username && u.password === password
        );
        
        if (!user) {
            return done(null, false, { message: "Incorrect credentials." });
        }
        return done(null, user);
    }
));

let hotels = [];
let users = [];

app.use(passport.initialize());

const authenticateUser = passport.authenticate("local", { session: false });

// ================= USER REGISTER =================

app.post("/register",(request, response) => {
    try {
        const newUser = {
            id: users.length + 1,
            name: request.body.name,
            username: request.body.username,
            email: request.body.email,
            password: request.body.password,
        };

        users.push(newUser);

        response.status(201).json({
            message: "User Registered Successfully.",
            user: newUser,
        });
    } catch (error) {
        response.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

// ================= GET ALL HOTELS =================

app.get("/hotels", (request, response) => {
    try {
        response.status(200).json(hotels);
    } catch (error) {
        response.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

// ================= GET Hotel BY ID =================

app.get("/hotels/:id", (request, response) => {
    try {
        const Hotel = hotels.find(
            (c) => c.id == request.params.id
        );

        if (!Hotel) {
            return response.status(404).json({
                message: "Hotel not found",
            });
        }

        response.status(200).json(Hotel);
    } catch (error) {
        response.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

// ================= ADD Hotel =================

app.post("/hotels", authenticateUser,(request, response) => {
    try {
        const newCollege = {
            id: hotels.length + 1,
            name: request.body.name,
            location: request.body.location,
            rating: request.body.rating,
            pricepernight: request.body.pricepernight,
        };

        hotels.push(newCollege);

        response.status(201).json({
            message: "Hotel Added Successfully.",
            Hotel: newCollege,
        });
    } catch (error) {
        response.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

// ================= UPDATE Hotel =================

app.put("/hotels/:id", authenticateUser, (request, response) => {
    try {
        let Hotel = hotels.find(
            (c) => c.id == request.params.id
        );

        if (!Hotel) {
            return response.status(404).json({
                message: "Hotel not found",
            });
        }

        Hotel.name = request.body.name;
        Hotel.location = request.body.location;

        response.status(200).json({
            message: "Hotel Updated Successfully",
            Hotel,
        });
    } catch (error) {
        response.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

// ================= DELETE Hotel =================

app.delete("/hotels/:id", authenticateUser, (request, response) => {
    try {
        const collegeIndex = hotels.findIndex(
            (c) => c.id == request.params.id
        );

        if (collegeIndex === -1) {
            return response.status(404).json({
                message: "Hotel not found",
            });
        }

        hotels.splice(collegeIndex, 1);

        response.status(200).json({
            message: "Hotel Deleted Successfully",
        });
    } catch (error) {
        response.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

// ================= SERVER =================

app.listen(1920, () => {
    console.log("Server is running on port 1920");
});
