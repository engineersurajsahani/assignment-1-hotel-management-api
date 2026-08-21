const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { users, getNextUserId } = require('../data/store');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "username, email, and password are required" });
        }

        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: getNextUserId(),
            username,
            email,
            password: hashedPassword
        };
        users.push(newUser);

        res.status(201).json({ message: "User registered successfully", user: { id: newUser.id, username, email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message || "Login failed" });

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.username } });
        });
    })(req, res, next);
});

module.exports = router;