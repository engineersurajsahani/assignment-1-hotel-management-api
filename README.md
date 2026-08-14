# Hotel Management API

A simple Node.js Express API for managing hotels, authentication, and basic logging.

**Author:** ADITYA SUNIL CHOUKSEY

**Roll No:** 150096725070

**Cohort:** SAM ALTMAN

## Features

- User authentication (routes/auth.js)
- Hotel management endpoints (routes/hotels.js)
- Request logging via middleware/logger.js

## Requirements

- Node.js (v14+ recommended)
- npm

## Installation

```bash
cd /Users/adityac17/Downloads/hotel-management-api
npm install
```

## Running

Start the server:

```bash
node server.js
```

The server listens on the port configured in `server.js` (default 3000).

## Development

- Add routes under `routes/`
- Add middleware under `middleware/`

## Contributing

Open an issue or submit a PR.

## Notes

This README was generated on request and includes author details for assignment submission.
# Hotel Management API

## Setup
```
npm install
node server.js
```
Server runs at http://localhost:3000

## Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /register | Register a new user |
| POST | /login | Login (passport-local) |
| POST | /logout | Logout |
| GET | / | Welcome route |
| GET | /hotels | Get all hotels (supports `?rating=5` filter) |
| GET | /hotels/:id | Get hotel by ID |
| POST | /hotels | Add a hotel (rejects duplicate names) |
| PUT | /hotels/:id | Update hotel |
| DELETE | /hotels/:id | Delete hotel |

Every request is logged to the console via middleware (`middleware/logger.js`).
