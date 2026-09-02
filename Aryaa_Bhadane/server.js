const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const app = express();
const PORT = 3000;



app.use(express.json());

app.use(
  session({
    secret: "hotel-management-secret",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());


let hotels = [
  {
    id: 1,
    name: "Taj Hotel",
    location: "Mumbai",
    rating: 5,
    pricePerNight: 12000
  },
  {
    id: 2,
    name: "The Oberoi",
    location: "Delhi",
    rating: 5,
    pricePerNight: 15000
  }
];

let users = [];



passport.use(
  new LocalStrategy(function (username, password, done) {
    const user = users.find((user) => user.username === username);

    if (!user) {
      return done(null, false, {
        message: "User not found"
      });
    }

    const passwordMatches = bcrypt.compareSync(password, user.password);

    if (!passwordMatches) {
      return done(null, false, {
        message: "Incorrect password"
      });
    }

    return done(null, user);
  })
);



passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  const user = users.find((user) => user.id === id);

  if (!user) {
    return done(null, false);
  }

  done(null, user);
});


app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Hotel APIs"
  });
});



app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Username, email and password are required"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    username: username,
    email: email,
    password: hashedPassword
  };

  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    }
  });
});



app.post(
  "/login",
  passport.authenticate("local"),
  (req, res) => {
    res.json({
      message: "Login successful",
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
      }
    });
  }
);



app.get("/hotels", (req, res) => {
  res.json(hotels);
});



app.get("/hotels/:id", (req, res) => {
  const id = Number(req.params.id);

  const hotel = hotels.find((hotel) => hotel.id === id);

  if (!hotel) {
    return res.status(404).json({
      message: "Hotel not found"
    });
  }

  res.json(hotel);
});



app.post("/hotels", (req, res) => {
  const { name, location, rating, pricePerNight } = req.body;

  if (!name || !location || rating === undefined || pricePerNight === undefined) {
    return res.status(400).json({
      message: "Name, location, rating and pricePerNight are required"
    });
  }

  const newHotel = {
    id: hotels.length + 1,
    name: name,
    location: location,
    rating: rating,
    pricePerNight: pricePerNight
  };

  hotels.push(newHotel);

  res.status(201).json(newHotel);
});



app.put("/hotels/:id", (req, res) => {
  const id = Number(req.params.id);

  const hotel = hotels.find((hotel) => hotel.id === id);

  if (!hotel) {
    return res.status(404).json({
      message: "Hotel not found"
    });
  }

  const { name, location, rating, pricePerNight } = req.body;

  if (name !== undefined) {
    hotel.name = name;
  }

  if (location !== undefined) {
    hotel.location = location;
  }

  if (rating !== undefined) {
    hotel.rating = rating;
  }

  if (pricePerNight !== undefined) {
    hotel.pricePerNight = pricePerNight;
  }

  res.json({
    message: "Hotel updated successfully",
    hotel: hotel
  });
});



app.delete("/hotels/:id", (req, res) => {
  const id = Number(req.params.id);

  const hotelIndex = hotels.findIndex((hotel) => hotel.id === id);

  if (hotelIndex === -1) {
    return res.status(404).json({
      message: "Hotel not found"
    });
  }

  const deletedHotel = hotels.splice(hotelIndex, 1);

  res.json({
    message: "Hotel deleted successfully",
    hotel: deletedHotel[0]
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});