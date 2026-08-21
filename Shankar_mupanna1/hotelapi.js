const express = require("express");
const passport =require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());

const requestLogger = (req, res, next) => {
  console.log("Request URL:", req.url);
  console.log("Request Method:", req.method);
  console.log("Date:", new Date().toLocaleString());
  next();
};

app.use(requestLogger);

let hotels = [];
let users = [];

passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find((u) => u.name === username);

    if (!user) {
      return done(null, false, { message: "Incorrect Username" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: "Incorrect Password" });
    }

    return done(null, user);
  })
);

app.use(passport.initialize());

const isAuthenticated = passport.authenticate("local", {
  session: false,
});

app.get("/", (req, res) => {
  res.send("Welcome to Hotel APIs");
});

app.post("/register", (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const newUser = {
      id: users.length + 1,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };

    users.push(newUser);

    res.json({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/login", isAuthenticated, (req, res) => {
  res.json({ message: "Login Successful" });
});

app.get("/hotels", (req, res) => {
  try {
    let result = hotels;

    if (req.query.rating) {
      result = hotels.filter(
        (hotel) => hotel.rating == req.query.rating
      );
    }

    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/hotels/:id", (req, res) => {
  try {
    const hotel = hotels.find((h) => h.id == req.params.id);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel Not Found",
      });
    }

    res.json(hotel);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/hotels", isAuthenticated, (req, res) => {
  try {
    const alreadyExists = hotels.find(
      (h) => h.name.toLowerCase() == req.body.name.toLowerCase()
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: "Hotel Name Already Exists",
      });
    }

    const newHotel = {
      id: hotels.length + 1,
      name: req.body.name,
      location: req.body.location,
      rating: req.body.rating,
      pricePerNight: req.body.pricePerNight,
    };

    hotels.push(newHotel);

    res.json({
      message: "Hotel Added Successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/hotels/:id", isAuthenticated, (req, res) => {
  try {
    let hotel = hotels.find(
      (h) => h.id == req.params.id
    );

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel Not Found",
      });
    }

    hotel.name = req.body.name;
    hotel.location = req.body.location;
    hotel.rating = req.body.rating;
    hotel.pricePerNight = req.body.pricePerNight;

    res.json({
      message: "Hotel Updated Successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/hotels/:id", isAuthenticated, (req, res) => {
  try {
    const hotelIndex = hotels.findIndex(
      (h) => h.id == req.params.id
    );

    if (hotelIndex == -1) {
      return res.status(404).json({
        message: "Hotel Not Found",
      });
    }

    hotels.splice(hotelIndex, 1);

    res.json({
      message: "Hotel Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(3000, () => {
  console.log("Server Running on Port 3000");
});