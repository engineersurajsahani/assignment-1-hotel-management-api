// In-memory data storage (no database required)

const hotels = [
  { id: 1, name: "Grand Palace", location: "Mumbai", rating: 5, pricePerNight: 12000 },
  { id: 2, name: "Ocean View Resort", location: "Goa", rating: 4, pricePerNight: 7500 },
];

const users = []; // { id, username, email, password (hashed) }

let hotelIdCounter = hotels.length + 1;
let userIdCounter = 1;

module.exports = {
  hotels,
  users,
  getNextHotelId: () => hotelIdCounter++,
  getNextUserId: () => userIdCounter++,
};
