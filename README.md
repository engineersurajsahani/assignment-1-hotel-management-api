# 🏨 Hotel Management REST API - Assignment 1

A RESTful Hotel Management API built with **Node.js**, **Express.js**, and **Passport.js** authentication.

---

## 🌐 Live Deployment

- **Live URL:** [https://hotelmanagementapi-74g8.onrender.com](https://hotelmanagementapi-74g8.onrender.com)
- **Base Endpoint:** `GET https://hotelmanagementapi-74g8.onrender.com/`

---

## 🚀 Quick Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/Soldier224K/HotelManagementAPI.git
cd HotelManagementAPI/Raj_Rasal_150096725066
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the server
```bash
npm start
# or
node server.js
```
The server will run on `http://localhost:3000` (or the port defined by `process.env.PORT`).

---

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status & welcome message |
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Authenticate user using Passport Local Strategy |
| `GET` | `/hotels` | Retrieve list of all hotels |
| `GET` | `/hotels/:id` | Retrieve details of a specific hotel by ID |

### Protected Endpoints (Requires Authentication)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/hotels` | Add a new hotel |
| `PUT` | `/hotels/:id` | Update hotel details by ID |
| `DELETE` | `/hotels/:id` | Delete a hotel by ID |

---

## 📝 Request & Response Examples

### 1. Register User (`POST /register`)
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Add New Hotel (`POST /hotels`)
```json
{
  "name": "Grand Palace",
  "location": "San Francisco",
  "rating": 4.7,
  "pricePerNight": 250
}
```

---

## 👤 Author

- **Student Name:** Raj Rasal
- **Student ID:** 150096725066
