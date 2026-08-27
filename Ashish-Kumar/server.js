const express = require("express");
const session = require("express-session");
const passport = require("./passport-config");
const requestLogger = require("./middleware/logger");
const authRoutes = require("./routes/auth");
const hotelRoutes = require("./routes/hotels");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(requestLogger); // Extra Task: request logging middleware

app.use(
  session({
    secret: "hotel-management-secret", // for assignment purposes only
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Hotel APIs");
});

app.use("/", authRoutes);       // /register, /login, /logout
app.use("/hotels", hotelRoutes); // /hotels, /hotels/:id

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Hotel Management API running on http://localhost:${PORT}`);
});
