const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const PORT = process.env.PORT || 3000;

const users = [];
let userIdCounter = 1;

const hotels = [
  {
    id: 1,
    name: 'Grand Palace',
    location: 'New York',
    rating: 5,
    pricePerNight: 250
  },
  {
    id: 2,
    name: 'Sea View Resort',
    location: 'Miami',
    rating: 4,
    pricePerNight: 180
  },
  {
    id: 3,
    name: 'Mountain Inn',
    location: 'Denver',
    rating: 3,
    pricePerNight: 120
  }
];
let hotelIdCounter = 4; 


app.use(express.json());


app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});


app.use(
  session({
    secret: 'hotel_secret_key',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());


passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find((u) => u.username === username);

    if (!user) {
      return done(null, false, { message: 'Invalid username or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Invalid username or password' });
    }

    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user);
});


app.get('/', (req, res) => {
  res.status(200).send('Welcome to Hotel APIs');
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  const existingUser = users.find((u) => u.username === username || u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'Username or Email already registered' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: userIdCounter++,
    username,
    email,
    password: hashedPassword
  };

  users.push(newUser);


  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    }
  });
});


app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info ? info.message : 'Authentication failed' });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    });
  })(req, res, next);
});


app.get('/hotels', (req, res) => {
  const { rating } = req.query;

  if (rating) {
    const numericRating = Number(rating);
    const filteredHotels = hotels.filter((h) => h.rating === numericRating);
    return res.status(200).json(filteredHotels);
  }

  res.status(200).json(hotels);
});


app.get('/hotels/:id', (req, res) => {
  const hotelId = Number(req.params.id);
  const hotel = hotels.find((h) => h.id === hotelId);

  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  res.status(200).json(hotel);
});


app.post('/hotels', (req, res) => {
  const { name, location, rating, pricePerNight } = req.body;


  if (!name || !location || rating === undefined || pricePerNight === undefined) {
    return res.status(400).json({ message: 'Name, location, rating, and pricePerNight are required' });
  }


  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
  }


  const isDuplicate = hotels.some((h) => h.name.toLowerCase() === name.toLowerCase());
  if (isDuplicate) {
    return res.status(409).json({ message: 'A hotel with this name already exists' });
  }

  const newHotel = {
    id: hotelIdCounter++,
    name,
    location,
    rating: numericRating,
    pricePerNight: Number(pricePerNight)
  };

  hotels.push(newHotel);

  res.status(201).json(newHotel);
});


app.put('/hotels/:id', (req, res) => {
  const hotelId = Number(req.params.id);
  const hotel = hotels.find((h) => h.id === hotelId);

  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  const { name, location, rating, pricePerNight } = req.body;

  if (name && name.toLowerCase() !== hotel.name.toLowerCase()) {
    const isDuplicate = hotels.some((h) => h.id !== hotelId && h.name.toLowerCase() === name.toLowerCase());
    if (isDuplicate) {
      return res.status(409).json({ message: 'A hotel with this name already exists' });
    }
    hotel.name = name;
  }

  if (location !== undefined) hotel.location = location;
  if (rating !== undefined) {
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }
    hotel.rating = numericRating;
  }
  if (pricePerNight !== undefined) hotel.pricePerNight = Number(pricePerNight);

  res.status(200).json(hotel);
});

app.delete('/hotels/:id', (req, res) => {
  const hotelId = Number(req.params.id);
  const hotelIndex = hotels.findIndex((h) => h.id === hotelId);

  if (hotelIndex === -1) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  hotels.splice(hotelIndex, 1);

  res.status(200).json({ message: 'Hotel deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Hotel Management API running on http://localhost:${PORT}`);
});
