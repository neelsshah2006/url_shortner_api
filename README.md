# URL Shortener API

A robust, secure, and scalable RESTful API for shortening URLs. This backend service enables users to register, authenticate, create, manage, and track shortened links with advanced session management, analytics, and security best practices.

> **Live API:** [https://url-shortner-api-k63s.onrender.com](https://url-shortner-api-k63s.onrender.com)

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [User Endpoints](#user-endpoints)
  - [URL Management](#url-management)
  - [Redirection](#redirection)
  - [Error Response Format](#error-response-format)
- [Authentication & Authorization](#authentication--authorization)
- [Folder Structure](#folder-structure)
- [Performance & Optimization](#performance--optimization)
- [Contributing](#contributing)
- [License](#license)
- [Contact / Credits](#contact--credits)

---

## Features

- **User Registration & Authentication** (JWT & HTTP-only cookies)
- **Advanced Session Management**: Configurable device/session limits, automatic cleanup
- **Secure Password Hashing**: Bcrypt with configurable salt rounds
- **URL Shortening**: Unique and custom short codes
- **Redirection & Analytics**: Track visits, device info, and timestamps
- **User Profile Management**: Update profile, change password
- **User-Specific Link Management**: List, update, and delete links
- **Automatic Token Cleanup**: Expired tokens removed automatically
- **Comprehensive Error Handling**: Consistent, structured error responses
- **CORS Protection**: Configurable cross-origin resource sharing

---

## Technology Stack

- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, bcrypt
- **Templating:** EJS
- **Validation:** express-validator
- **Security:** helmet, cookie-parser, cors
- **Other:** dotenv, morgan, ua-parser-js

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

### Installation

```bash
git clone https://github.com/neelsshah2006/url_shortner_api.git
cd url_shortner_api
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/url_shortner
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
NODE_ENV=development
ROUNDS=15
MAX_DEVICES=5
FRONTEND_URL=your_frontend_website_url
```

| Variable             | Description                                 | Example     |
| -------------------- | ------------------------------------------- | ----------- |
| PORT                 | Port to run the server on                   | 5000        |
| MONGO_URL            | MongoDB connection string                   | -           |
| ACCESS_TOKEN_SECRET  | Secret key for access token signing         | -           |
| REFRESH_TOKEN_SECRET | Secret key for refresh token signing        | -           |
| ACCESS_TOKEN_EXPIRY  | Access token expiration time                | 15m         |
| REFRESH_TOKEN_EXPIRY | Refresh token expiration time               | 7d          |
| NODE_ENV             | Environment (development/production)        | development |
| ROUNDS               | Bcrypt salt rounds for password hash        | 15          |
| MAX_DEVICES          | Maximum concurrent devices per user         | 5           |
| FRONTEND_URL         | Allowed frontend origin for CORS (optional) |             |

> **Note:**
>
> - `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are **required** for JWT authentication.
> - `MAX_DEVICES` controls how many concurrent sessions a user can have.
> - If `FRONTEND_URL` is not set, API will accept requests from all origins.

### Running the Project

```bash
npm start
# or
node server.js
```

The server will start on `http://localhost:5000` (or your specified port).

---

## API Documentation

### Authentication

#### Register

- **POST** `/auth/register`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "firstName": "Neel",
    "lastName": "Shah",
    "username": "neelsshah2006",
    "email": "neelsshah2006@gmail.com",
    "password": "Password@123"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "success": true,
    "message": "User Registered Successfully",
    "data": {
      "_id": "...",
      "fullName": {
        "firstName": "Neel",
        "lastName": "Shah",
        "_id": "..."
      },
      "username": "neelsshah2006",
      "email": "neelsshah2006@gmail.com",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "statusCode": 201,
    "timestamp": "..."
  }
  ```

#### Login

- **POST** `/auth/login`
- **Description:** Login with email or username.
- **Request Body:**
  ```json
  { "email": "neelsshah2006@gmail.com", "password": "Password@123" }
  ```
  or
  ```json
  { "username": "neelsshah2006", "password": "Password@123" }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "User Login Successful",
    "data": {
      "_id": "...",
      "fullName": {
        "firstName": "Neel",
        "lastName": "Shah",
        "_id": "..."
      },
      "username": "neelsshah2006",
      "email": "neelsshah2006@gmail.com",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "statusCode": 200,
    "timestamp": "..."
  }
  ```

#### Logout

- **GET** `/auth/logout`
- **Authentication:** Cookie
- **Description:** Logs out user and removes refresh token from active sessions.
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Logged Out Successfully",
    "data": "Logged Out",
    "statusCode": 200,
    "timestamp": "..."
  }
  ```

---

### User Endpoints

#### Get Profile

- **GET** `/user/profile`
- **Authentication:** Cookie
- **Description:** Get current user's profile.
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Profile Sent Successfully",
    "data": {
      "user": {
        "_id": "...",
        "fullName": {
          "firstName": "Neel",
          "lastName": "Shah",
          "_id": "..."
        },
        "username": "neelsshah2006",
        "email": "neelsshah2006@gmail.com",
        "createdAt": "...",
        "updatedAt": "..."
      }
    },
    "statusCode": 200,
    "timestamp": "..."
  }
  ```

#### Update Profile

- **PATCH** `/user/update-profile`
- **Authentication:** Cookie
- **Request Body:**
  ```json
  { "firstName": "Moksh", "lastName": "Shah", "username": "mokshshah" }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Profile Updated Successfully",
    "data": {
      "user": {
        "_id": "...",
        "fullName": {
          "firstName": "Moksh",
          "lastName": "Shah",
          "_id": "..."
        },
        "username": "mokshshah",
        "email": "neelsshah2006@gmail.com",
        "createdAt": "...",
        "updatedAt": "..."
      }
    },
    "statusCode": 200,
    "timestamp": "..."
  }
  ```

#### Change Password

- **PATCH** `/user/change-password`
- **Authentication:** Cookie
- **Request Body:**
  ```json
  { "oldPassword": "Password@123", "newPassword": "NewPass@456" }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Password Changed Successfully",
    "data": {
      "user": {
        "_id": "...",
        "fullName": {
          "firstName": "Moksh",
          "lastName": "Shah",
          "_id": "..."
        },
        "username": "mokshshah",
        "email": "neelsshah2006@gmail.com",
        "createdAt": "...",
        "updatedAt": "..."
      }
    },
    "statusCode": 200,
    "timestamp": "..."
  }
  ```

#### Get User Links

- **GET** `/user/get-links`
- **Authentication:** Cookie
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Links Sent Successfully",
    "data": {
      "links": [
        {
          "_id": "...",
          "longUrl": "https://example.com",
          "shortCode": "xxxxxx",
          "visitCount": 1,
          "createdAt": "..."
        }
      ]
    },
    "statusCode": 200,
    "timestamp": "..."
  }
  ```

---

### URL Management

#### Shorten URL

- **POST** `/url/shorten`
- **Authentication:** Cookie
- **Request Body:**
  ```json
  { "longUrl": "https://example.com" }
  ```
- **Response:** `201 Created`
  ```json
  {
    "success": true,
    "message": "URL Shortened Successfully",
    "data": {
      "shortUrl": {
        "user": "...",
        "longUrl": "https://example.com",
        "shortCode": "xxxxxx",
        "visitCount": 0,
        "_id": "...",
        "createdAt": "...",
        "updatedAt": "...",
        "__v": 0
      }
    },
    "statusCode": 201,
    "timestamp": "..."
  }
  ```

#### Change Shortened URL to a Custom URL

- **PATCH** `/url/custom-url`
- **Authentication:** Cookie
- **Request Body:**
  ```json
  {
    "existingCode": "xxxxxx",
    "customCode": "example"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Custom Code attached successfully",
    "data": {
      "shortUrl": {
        "_id": "...",
        "user": "...",
        "longUrl": "https://example.com",
        "shortCode": "example",
        "visitCount": 0,
        "createdAt": "...",
        "updatedAt": "...",
        "__v": 0
      }
    },
    "statusCode": 200,
    "timestamp": "..."
  }
  ```

#### Get URL Stats

- **GET** `/url/stats?shortCode=xxxxxx`
- **Authentication:** Cookie
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "URL Stats sent Successfully",
    "data": {
      "shortUrl": {
        "_id": "...",
        "user": "...",
        "longUrl": "https://example.com",
        "shortCode": "xxxxxx",
        "visitCount": 1,
        "createdAt": "...",
        "updatedAt": "...",
        "__v": 0
      },
      "clicks": [
        {
          "_id": "...",
          "url": "...",
          "continent": "Asia",
          "country": "India",
          "state": "Gujarat",
          "city": "Surat",
          "location": {
            "ltd": "21.1981",
            "lng": "72.8298",
            "_id": "..."
          },
          "browser": "Chrome",
          "os": "Windows",
          "device": "desktop",
          "createdAt": "...",
          "updatedAt": "...",
          "__v": 0
        }
      ]
    },
    "statusCode": 200,
    "timestamp": "..."
  }
  ```

#### Delete URL

- **DELETE** `/url/delete?shortCode=xxxxxx`
- **Authentication:** Cookie
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "URL Deleted Successfully",
    "data": {
      "deletedUrl": {
        "_id": "...",
        "user": "...",
        "longUrl": "https://example.com",
        "shortCode": "xxxxxx",
        "visitCount": 1,
        "createdAt": "...",
        "updatedAt": "...",
        "__v": 0
      }
    },
    "statusCode": 200,
    "timestamp": "..."
  }
  ```

---

### Redirection

#### Redirect to Original URL

- **GET** `/:shortCode`
- **Description:** Redirects to the original URL if found, otherwise shows a not found page.

---

### Error Response Format

All errors follow a consistent structure:

```json
{
  "success": false,
  "message": "Error message",
  "errorCode": "BAD_REQUEST",
  "statusCode": 400,
  "timestamp": "2025-06-21T12:00:00.000Z",
  "stack": "..." // Only in development mode
}
```

| Status | Error Code            | Description                 |
| ------ | --------------------- | --------------------------- |
| 400    | BAD_REQUEST           | Validation or input error   |
| 401    | UNAUTHORIZED          | Authentication required     |
| 404    | NOT_FOUND             | Resource not found          |
| 409    | CONFLICT              | Duplicate or conflict error |
| 500    | INTERNAL_SERVER_ERROR | Server error                |

---

## Authentication & Authorization

- **Dual Token System:** Short-lived access tokens and long-lived refresh tokens (HTTP-only cookies)
- **Session/Device Limit:** Configurable via `MAX_DEVICES` (default: 5). Oldest sessions are removed when limit is exceeded.
- **Automatic Token Cleanup:** Expired tokens are removed automatically.
- **Password Security:** Bcrypt hashing with configurable salt rounds.
- **CORS:** If `FRONTEND_URL` is set, only requests from that origin are allowed.

---

## Folder Structure

```
url_shortner_api/
│
├── server.js
├── app.js
├── .env
├── package.json
├── db/
│   └── mongodb.config.js
├── controllers/
│   ├── url.controller.js
│   ├── user.controller.js
│   ├── auth.controller.js
│   └── redirect.controller.js
├── middleware/
│   ├── auth.middleware.js
│   └── errorHandler.middleware.js
├── models/
│   ├── url.model.js
│   ├── user.model.js
│   └── click.model.js
├── routes/
│   ├── redirect.routes.js
│   ├── url.routes.js
│   ├── user.routes.js
│   └── auth.routes.js
├── services/
│   ├── auth.service.js
│   ├── url.service.js
│   ├── user.service.js
│   └── redirect.service.js
├── public/
│   ├── images/
│   ├── javascripts/
│   └── stylesheets/
├── views/
│   ├── homepage.ejs
│   └── notfound.ejs
├── utils/
│   ├── appError.util.js
│   ├── catchAsync.util.js
│   ├── response.util.js
│   ├── crypto.util.js
│   ├── refreshTokenValidator.util.js
│   ├── setCookie.util.js
│   ├── browserReqChecker.util.js
│   └── UAParser.util.js
└── ...
```

---

## Performance & Optimization

- **Token Validation:** Fast JWT parsing and verification
- **Bulk Database Operations:** Efficient cleanup with `bulkWrite()`
- **Automatic Cleanup:** Expired tokens and sessions are removed automatically
- **Device Management:** Configurable session limits, automatic session removal
- **Database Optimization:** Indexed fields, efficient queries, and schema evolution support

---

## Contributing

1. Fork the repository
2. Create your branch (`git checkout -b branchName`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin branchName`)
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact / Credits

- **Author:** [Neel Shah](mailto:neelsshah2006@gmail.com)
- **GitHub:** [neelsshah2006](https://github.com/neelsshah2006)
- **LinkedIn:** [linkedin.com/in/neelsshah2006](https://linkedin.com/in/neelsshah2006)

---

\*\*Feel free to contribute and improve this project!\*\*
