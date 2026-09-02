const express = require("express");
const router = express.Router();
const { hotels, getNextHotelId } = require("../data");

// GET /hotels - Get all hotels (supports ?rating=5 filtering - Extra Task)
router.get("/", (req, res) => {
  const { rating } = req.query;

  if (rating !== undefined) {
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: "rating must be a number between 1 and 5." });
    }
    const filtered = hotels.filter((h) => h.rating === ratingNum);
    return res.status(200).json(filtered);
  }

  res.status(200).json(hotels);
});

// GET /hotels/:id - Get a specific hotel by ID
router.get("/:id", (req, res) => {
  const hotel = hotels.find((h) => h.id === Number(req.params.id));
  if (!hotel) {
    return res.status(404).json({ message: "Hotel not found." });
  }
  res.status(200).json(hotel);
});

// POST /hotels - Add a new hotel (validate duplicate names - Extra Task)
router.post("/", (req, res) => {
  const { name, location, rating, pricePerNight } = req.body;

  if (!name || !location || rating === undefined || pricePerNight === undefined) {
    return res.status(400).json({
      message: "name, location, rating and pricePerNight are required.",
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "rating must be between 1 and 5." });
  }

  const duplicate = hotels.find(
    (h) => h.name.toLowerCase() === name.toLowerCase()
  );
  if (duplicate) {
    return res.status(409).json({ message: "A hotel with this name already exists." });
  }

  const newHotel = {
    id: getNextHotelId(),
    name,
    location,
    rating,
    pricePerNight,
  };

  hotels.push(newHotel);
  res.status(201).json(newHotel);
});

// PUT /hotels/:id - Update hotel details
router.put("/:id", (req, res) => {
  const hotel = hotels.find((h) => h.id === Number(req.params.id));
  if (!hotel) {
    return res.status(404).json({ message: "Hotel not found." });
  }

  const { name, location, rating, pricePerNight } = req.body;

  if (name && name.toLowerCase() !== hotel.name.toLowerCase()) {
    const duplicate = hotels.find(
      (h) => h.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      return res.status(409).json({ message: "A hotel with this name already exists." });
    }
  }

  if (rating !== undefined && (rating < 1 || rating > 5)) {
    return res.status(400).json({ message: "rating must be between 1 and 5." });
  }

  if (name !== undefined) hotel.name = name;
  if (location !== undefined) hotel.location = location;
  if (rating !== undefined) hotel.rating = rating;
  if (pricePerNight !== undefined) hotel.pricePerNight = pricePerNight;

  res.status(200).json(hotel);
});

// DELETE /hotels/:id - Delete a hotel by ID
router.delete("/:id", (req, res) => {
  const index = hotels.findIndex((h) => h.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Hotel not found." });
  }

  const deleted = hotels.splice(index, 1);
  res.status(200).json({ message: "Hotel deleted successfully.", hotel: deleted[0] });
});

module.exports = router;
