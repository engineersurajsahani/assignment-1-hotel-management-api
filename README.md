# Hotel Management API

A RESTful Hotel Management API built using **Node.js and Express.js** as part of Assignment 1.

## Objective

Build a RESTful API for managing hotels and user authentication using Node.js and Express.js.

## Technologies Used

* Node.js
* Express.js
* bcryptjs
* Passport.js
* Passport-Local
* Express Session
* Postman for API testing
* In-memory JavaScript arrays for data storage

## Data Entities

### Hotel

Each hotel contains:

* `id` - Number
* `name` - String
* `location` - String
* `rating` - Number from 1 to 5
* `pricePerNight` - Number

### User

Each user contains:

* `id` - Number
* `username` - String
* `email` - String
* `password` - Hashed using bcryptjs

## API Endpoints

| Method | Endpoint      | Description                       |
| ------ | ------------- | --------------------------------- |
| POST   | `/register`   | Register a new user               |
| POST   | `/login`      | Login using username and password |
| GET    | `/`           | Returns welcome message           |
| GET    | `/hotels`     | Get all hotels                    |
| GET    | `/hotels/:id` | Get a specific hotel by ID        |
| POST   | `/hotels`     | Add a new hotel                   |
| PUT    | `/hotels/:id` | Update hotel details              |
| DELETE | `/hotels/:id` | Delete a hotel by ID              |

## Extra Tasks Implemented

### Duplicate Hotel Validation

The API prevents adding a hotel with a duplicate name.

### Hotel Rating Filter

Hotels can be filtered by rating using:

```text
GET /hotels?rating=5
```

### Request Logging Middleware

The API logs incoming requests with their timestamp, HTTP method, and URL.

Example:

```text
[2026-07-30T12:00:00.000Z] GET /hotels
```

## Authentication

User passwords are hashed using **bcryptjs** before being stored.

Authentication is implemented using **Passport-Local** and **Express Session**.

## Data Storage

The project uses in-memory JavaScript arrays instead of a database, as required by the assignment.

Because the data is stored in memory, registered users and newly added or modified hotels are reset when the server is restarted.

## Installation

Clone the repository and install the required dependencies:

```bash
npm install
```

## Running the Server

Start the server using:

```bash
node server.js
```

The API runs on:

```text
http://localhost:3000
```

## Example Requests

### Register User

**POST**

```text
http://localhost:3000/register
```

Body:

```json
{
  "username": "Pallavi",
  "email": "pallavi@gmail.com",
  "password": "123456"
}
```

### Login

**POST**

```text
http://localhost:3000/login
```

Body:

```json
{
  "username": "Pallavi",
  "password": "123456"
}
```

### Get All Hotels

**GET**

```text
http://localhost:3000/hotels
```

### Filter 5-Star Hotels

**GET**

```text
http://localhost:3000/hotels?rating=5
```

### Add Hotel

**POST**

```text
http://localhost:3000/hotels
```

Body:

```json
{
  "name": "Taj Hotel",
  "location": "Mumbai",
  "rating": 5,
  "pricePerNight": 500
}
```

## Testing

The API endpoints were tested using **Postman/Thunder Client**.

The following operations were tested:

* User registration
* User login
* Get all hotels
* Get hotel by ID
* Add hotel
* Update hotel
* Delete hotel
* Hotel rating filtering
* Duplicate hotel validation

## Note

This project is created for educational purposes as part of the Hotel Management API assignment.
