# Hotel Management API

A RESTful Hotel Management API built using **Node.js, Express.js, Passport.js, and bcryptjs**. The API provides user registration and login along with CRUD operations for managing hotel information.

## Technologies Used

* **Node.js** – JavaScript runtime environment
* **Express.js** – Web framework for building the REST API
* **bcryptjs** – Password hashing
* **Passport.js** – Authentication middleware
* **passport-local** – Username and password authentication
* **express-session** – Session management
* **Thunder Client** – API testing
* **In-Memory Storage** – Used for storing users and hotels without a database

## Features

### User Authentication

* User registration
* Password hashing using bcrypt
* User login using Passport Local Strategy
* Session-based authentication
* Protected hotel operations

### Hotel Management

* Get all hotels
* Get a hotel by ID
* Add a new hotel
* Update hotel details
* Delete a hotel
* Input validation for rating and price

## API Endpoints

| Method | Endpoint      | Description                       | Authentication |
| ------ | ------------- | --------------------------------- | -------------- |
| GET    | `/`           | Welcome message                   | No             |
| POST   | `/register`   | Register a new user               | No             |
| POST   | `/login`      | Login using username and password | No             |
| GET    | `/hotels`     | Get all hotels                    | No             |
| GET    | `/hotels/:id` | Get a hotel by ID                 | No             |
| POST   | `/hotels`     | Add a new hotel                   | Yes            |
| PUT    | `/hotels/:id` | Update hotel details              | Yes            |
| DELETE | `/hotels/:id` | Delete a hotel                    | Yes            |

## Hotel Fields

Each hotel contains:

```json
{
  "id": 1,
  "name": "Taj Hotel",
  "location": "Mumbai",
  "rating": 5,
  "pricePerNight": 8000
}
```

### Field Description

* `id` – Unique hotel ID
* `name` – Name of the hotel
* `location` – Hotel location
* `rating` – Rating between 1 and 5
* `pricePerNight` – Price of one night's stay

## User Fields

Users are stored with the following information:

```json
{
  "id": 1,
  "username": "jui",
  "email": "jui@example.com",
  "password": "hashed-password"
}
```

Passwords are never stored as plain text. They are hashed using **bcryptjs**.

## Project Structure

```text
assignment-1-hotel-management-api/
│
├── node_modules/
│
├── screenshots/
│   ├── register.png
│   ├── login.png
│   ├── get-hotels.png
│   ├── add-hotel.png
│   ├── update-hotel.png
│   └── delete-hotel.png
│
├── .gitignore
├── app.js
├── Assignment 1.txt
├── package.json
├── package-lock.json
└── README.md
```

> `node_modules` is not pushed to GitHub because it is included in `.gitignore`.

## Installation

Clone the repository and move into the project directory:

```bash
git clone <your-repository-url>
cd assignment-1-hotel-management-api
```

Install the required dependencies:

```bash
npm install
```

## Dependencies

The project uses:

```bash
npm install express bcryptjs express-session passport passport-local
```

## Running the Server

Start the server using:

```bash
node app.js
```

The server will run at:

```text
http://localhost:3000
```

You should see:

```text
Server Running at http://localhost:3000
```

## Testing the API

The API can be tested using **Thunder Client** or **Postman**.

### 1. Register

**POST**

```text
http://localhost:3000/register
```

Body:

```json
{
  "username": "jui",
  "email": "jui@example.com",
  "password": "123456"
}
```

### 2. Login

**POST**

```text
http://localhost:3000/login
```

Body:

```json
{
  "username": "jui",
  "password": "123456"
}
```

After successful login, a session is created.

### 3. Get All Hotels

**GET**

```text
http://localhost:3000/hotels
```

### 4. Get Hotel by ID

**GET**

```text
http://localhost:3000/hotels/1
```

### 5. Add Hotel

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
  "pricePerNight": 8000
}
```

Login is required before using this endpoint.

### 6. Update Hotel

**PUT**

```text
http://localhost:3000/hotels/1
```

Body:

```json
{
  "rating": 4,
  "pricePerNight": 7500
}
```

Login is required.

### 7. Delete Hotel

**DELETE**

```text
http://localhost:3000/hotels/1
```

Login is required.

## Authentication

The project uses **Passport Local Strategy** for authentication.

The authentication flow is:

```text
User Registration
       ↓
Password hashed using bcrypt
       ↓
User stored in memory
       ↓
User Login
       ↓
Passport verifies username & password
       ↓
Session created
       ↓
Protected hotel operations allowed
```

Protected endpoints:

```text
POST   /hotels
PUT    /hotels/:id
DELETE /hotels/:id
```

If a user is not logged in, the API returns:

```json
{
  "success": false,
  "message": "Please login first."
}
```

with status code:

```text
401 Unauthorized
```

## HTTP Status Codes Used

| Status Code | Meaning                           |
| ----------- | --------------------------------- |
| 200         | Request successful                |
| 201         | Resource successfully created     |
| 400         | Invalid request or missing fields |
| 401         | Authentication required           |
| 404         | Resource not found                |
| 409         | Duplicate resource                |

## Important Note

This project uses **in-memory storage**, as required by the assignment. Therefore, users and hotel data are stored only while the server is running.

When the server is stopped or restarted, the stored data is reset.

## Author

**Jui Tawde**

Hotel Management API – Assignment 1
