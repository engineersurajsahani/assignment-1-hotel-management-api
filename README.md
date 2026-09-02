# Hotel Management API

RESTful API for Assignment 1 Hotel Management using:

- Node.js + Express.js
- Passport + passport-local for authentication
- bcryptjs for password hashing
- express-session for login sessions
- In-memory data storage (no database required)

## Project Structure

```
hotel-api/
├── middleware/
│   └── logger.js          # Request logging middleware
├── routes/
│   ├── auth.js            # Register, login, logout
│   └── hotels.js          # Hotel CRUD operations
├── data.js                # In-memory data storage
├── passport-config.js     # Passport Local strategy setup
├── server.js              # Express entry point
└── package.json
```

## Install

```bash
npm install
```

## Start the API

```bash
node server.js
```

The API runs at `http://localhost:3000` by default.

## Authentication

Passwords are hashed with bcryptjs before being stored. Passport Local authenticates users using `username` and `password`. Successful login creates an HTTP session.

> **Note:** Data is stored in memory — all users and hotels reset when the server restarts.

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Login with username and password |
| POST | `/logout` | Yes | Logout and destroy session |

### Hotels

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/hotels` | No | Get all hotels (supports `?rating=` filter) |
| GET | `/hotels/:id` | No | Get a specific hotel |
| POST | `/hotels` | No | Add a new hotel |
| PUT | `/hotels/:id` | No | Update hotel details |
| DELETE | `/hotels/:id` | No | Delete a hotel |

## Example Request Bodies

### Register

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```json
{
  "username": "john",
  "password": "password123"
}
```

### Create Hotel

```json
{
  "name": "Grand Palace",
  "location": "Mumbai",
  "rating": 5,
  "pricePerNight": 12000
}
```

### Filter Hotels by Rating

```
GET /hotels?rating=5
```

## Pre-seeded Data

The API starts with two hotels already loaded:

| ID | Name | Location | Rating | Price/Night |
|----|------|----------|--------|-------------|
| 1 | Grand Palace | Mumbai | 5 | ₹12,000 |
| 2 | Ocean View Resort | Goa | 4 | ₹7,500 |

## Extra Tasks Implemented

- **Request logging middleware** — logs `[timestamp] METHOD /path` for every request
- **Rating filter** — `GET /hotels?rating=5` filters hotels by rating
- **Duplicate name validation** — prevents creating hotels with duplicate names (returns 409)

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Successful read/update/login/logout |
| 201 | Successful creation/registration |
| 400 | Validation error or missing fields |
| 401 | Unauthenticated or invalid credentials |
| 404 | Resource or route not found |
| 409 | Duplicate username or hotel name |
| 500 | Unexpected server error |
