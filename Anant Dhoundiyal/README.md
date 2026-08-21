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
