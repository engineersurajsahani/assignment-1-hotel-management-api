let hotels = [];
let users = [];
let hotelIdCounter = 1;
let userIdCounter = 1;

module.exports = {
    hotels,
    users,
    getNextHotelId: () => hotelIdCounter++,
    getNextUserId: () => userIdCounter++
};