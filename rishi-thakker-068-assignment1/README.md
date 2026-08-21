Name: Rishi Thakker
Roll No.: 150096725068
Cohort : Sam Altman

# Hotel Management API

A RESTful API to manage hotels, with user registration/login (Node.js, Express, Passport-local, bcrypt). Data is stored in-memory (no database).

## Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register a new user (bcrypt-hashed password) |
| POST | `/login` | No | Log in via Passport local strategy, returns user info |
| GET | `/` | No | Welcome route |
| GET | `/hotels` | No | Get all hotels, optionally filter by `?rating=` |
| GET | `/hotels/:id` | No | Get a single hotel by ID |
| POST | `/hotels` | No | Add a new hotel |
| PUT | `/hotels/:id` | No | Update a hotel |
| DELETE | `/hotels/:id` | No | Delete a hotel |

Auth uses Passport local strategy in stateless mode (`session: false`) — no JWT or session cookie is issued, and the hotel routes aren't actually gated behind login in this version.
