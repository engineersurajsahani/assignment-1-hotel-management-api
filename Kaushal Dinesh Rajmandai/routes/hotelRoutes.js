const express = require('express');
const { hotels, getNextHotelId } = require('../data/store');

const router = express.Router();

// GET all hotels (supports ?rating=5 filtering)
router.get('/', (req, res) => {
    const { rating } = req.query;
    if (rating) {
        const filtered = hotels.filter(h => h.rating === Number(rating));
        return res.status(200).json(filtered);
    }
    res.status(200).json(hotels);
});

// GET hotel by id
router.get('/:id', (req, res) => {
    const hotel = hotels.find(h => h.id === Number(req.params.id));
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.status(200).json(hotel);
});

// POST new hotel
router.post('/', (req, res) => {
    try {
        const { name, location, rating, pricePerNight } = req.body;
        if (!name || !location || !rating || !pricePerNight) {
            return res.status(400).json({ message: "name, location, rating, and pricePerNight are required" });
        }

        const duplicate = hotels.find(h => h.name.toLowerCase() === name.toLowerCase());
        if (duplicate) {
            return res.status(400).json({ message: "A hotel with this name already exists" });
        }

        const newHotel = {
            id: getNextHotelId(),
            name,
            location,
            rating: Number(rating),
            pricePerNight: Number(pricePerNight)
        };
        hotels.push(newHotel);
        res.status(201).json({ message: "Hotel added successfully", hotel: newHotel });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update hotel
router.put('/:id', (req, res) => {
    const hotel = hotels.find(h => h.id === Number(req.params.id));
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const { name, location, rating, pricePerNight } = req.body;
    if (name) hotel.name = name;
    if (location) hotel.location = location;
    if (rating) hotel.rating = Number(rating);
    if (pricePerNight) hotel.pricePerNight = Number(pricePerNight);

    res.status(200).json({ message: "Hotel updated successfully", hotel });
});

// DELETE hotel
router.delete('/:id', (req, res) => {
    const index = hotels.findIndex(h => h.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Hotel not found" });

    const deleted = hotels.splice(index, 1);
    res.status(200).json({ message: "Hotel deleted successfully", hotel: deleted[0] });
});

module.exports = router;