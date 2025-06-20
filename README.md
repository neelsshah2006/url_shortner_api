# URL Shortener API

A minimal and efficient RESTful API for shortening URLs. This backend service allows users to register, authenticate, create, manage, and track shortened links with robust authentication and statistics.

API is currently openly availabe. Each of the following API Endpoint is currently live on the domain: https://url-shortner-api-k63s.onrender.com

---

## Features

- User registration and authentication (JWT & cookies)
- **🔒 Advanced Session Management**: Configurable device limit with automatic cleanup
- Secure password hashing with bcrypt
- URL shortening with unique short codes
- Creation and Editing of Custom URLs
- Redirection to original URLs with visit tracking
- URL statistics (visit count, creation date)
- User profile management
- User-specific link management
- **🚀 Automatic Token Cleanup**: Expired tokens removed automatically
- **🛡️ Backward Compatible**: Seamless migration from old token formats
- Clean API documentation and comprehensive error handling

---

## Technology Stack

- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, bcrypt
- **Templating:** EJS
- **Validation:** express-validator
- **Other:** dotenv, cookie-parser, morgan, cors, helmet

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

| Variable             | Description                          | Default |
| -------------------- | ------------------------------------ | ------- |
| PORT                 | Port to run the server on            | 3000    |
| MONGO_URL            | MongoDB connection string            | -       |
| ACCESS_TOKEN_SECRET  | Secret key for access token signing  | -       |
| REFRESH_TOKEN_SECRET | Secret key for refresh token signing | -       |
| ACCESS_TOKEN_EXPIRY  | Access token expiration time         | -       |
| REFRESH_TOKEN_EXPIRY | Refresh token expiration time        | -       |
| NODE_ENV             | Environment (development/production) | -       |
| ROUNDS               | Bcrypt salt rounds for password hash | 10      |
| MAX_DEVICES          | Maximum concurrent devices per user  | 5       |
| FRONTEND_URL         | Your Frontend Website URL (Optional) | -       |

**Important Notes:**

- `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are **required** for JWT authentication
- `MAX_DEVICES` controls how many concurrent sessions a user can have (default: 5)
- `FRONTEND_URL` is optional - if not provided, API will accept requests from all websites
- When a user exceeds the device limit, the oldest session is automatically removed

### Running the Project

```bash
npm start
# or
node server.js
```

The server will start on `http://localhost:5000` (or your specified port in the environment variables).

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
- **Response:**
  - `201 Created`
    ```json
    {
      "success": true,
      "message": "User Registered Successfully",
      "data": {
        "fullName": {
          "firstName": "Neel",
          "lastName": "Shah",
          "_id": "..."
        },
        "username": "neelsshah2006",
        "email": "neelsshah2006@gmail.com",
        "_id": "...",
        "createdAt": "2025-06-20T16:48:02.612Z",
        "updatedAt": "2025-06-20T16:48:02.659Z",
        "__v": 1
      },
      "statusCode": 201,
      "timestamp": "2025-06-20T16:48:02.678Z"
    }
    ```
  - `400/409/500` with error message

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
- **Response:**
  - `200 OK` with JWT token and user info
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
        "createdAt": "2025-06-20T16:48:02.612Z",
        "updatedAt": "2025-06-20T16:49:38.295Z",
        "__v": 2
      },
      "statusCode": 200,
      "timestamp": "2025-06-20T16:49:38.302Z"
    }
    ```
  - `400/401/404/500` with error message

#### Logout

- **GET** `/auth/logout`
- **Authentication:** Cookie
- **Description:** Logs out user and removes refresh token from active sessions.
- **Response:**
  - `200 OK` with success message
    ```json
    {
      "success": true,
      "message": "Logged Out Successfully",
      "data": "Logged Out",
      "statusCode": 200,
      "timestamp": "..."
    }
    ```
  - `400/401/500` with error message

---

### User

#### Get Profile

- **GET** `/user/profile`
- **Authentication:** Cookie
- **Description:** Get current user's profile.
- **Response:**
  - `200 OK` with user profile
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
          "createdAt": "2025-06-20T16:48:02.612Z",
          "updatedAt": "2025-06-20T16:49:38.295Z",
          "__v": 2
        }
      },
      "statusCode": 200,
      "timestamp": "2025-06-20T16:52:02.543Z"
    }
    ```
  - `401/500` with error message

#### Update Profile

- **PATCH** `/user/update-profile`
- **Authentication:** Cookie
- **Body:**
  ```json
  { "firstName": "Moksh", "lastName": "Shah", "username": "mokshshah" }
  ```
- **Response:**
  - `200 OK` with updated profile
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
          "createdAt": "2025-06-20T16:48:02.612Z",
          "updatedAt": "2025-06-20T16:54:31.881Z",
          "__v": 2
        }
      },
      "statusCode": 200,
      "timestamp": "2025-06-20T16:54:31.888Z"
    }
    ```
  - `400/401/500` with error message

#### Change Password

- **PATCH** `/user/change-password`
- **Authentication:** Cookie
- **Body:**
  ```json
  { "oldPassword": "Password@123", "newPassword": "NewPass@456" }
  ```
- **Response:**
  - `200 OK` with updated user info
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
          "createdAt": "2025-06-20T16:48:02.612Z",
          "updatedAt": "2025-06-20T16:58:03.667Z",
          "__v": 2
        }
      },
      "statusCode": 200,
      "timestamp": "2025-06-20T16:58:03.690Z"
    }
    ```
  - `400/401/500` with error message

#### Get User Links

- **GET** `/user/get-links`
- **Authentication:** Cookie
- **Response:**
  - `200 OK` with list of user's URLs
    ```json
    {
      "success": true,
      "message": "Links Sent Successfully",
      "data": {
        "links": [
          {
            "_id": "...",
            "longUrl": "https://example.com",
            "shortCode": "4p9FIv",
            "visitCount": 0,
            "createdAt": "2025-06-20T16:58:48.439Z"
          },
          {
            "_id": "...",
            "longUrl": "https://www.google.com",
            "shortCode": "google",
            "visitCount": 0,
            "createdAt": "2025-06-20T16:55:52.757Z"
          }
        ]
      },
      "statusCode": 200,
      "timestamp": "2025-06-20T17:01:31.857Z"
    }
    ```
  - `401/500` with error message

---

### URL

#### Shorten URL

- **POST** `/url/shorten`
- **Authentication:** Cookie
- **Body:**
  ```json
  { "longUrl": "https://example.com" }
  ```
- **Response:**
  - `200 OK` with shortened URL info
    ```json
    {
      "success": true,
      "message": "URL Shortened Successfully",
      "data": {
        "shortUrl": {
          "user": "...",
          "longUrl": "https://example.com",
          "shortCode": "4p9FIv",
          "visitCount": 0,
          "_id": "...",
          "createdAt": "2025-06-20T16:58:48.439Z",
          "updatedAt": "2025-06-20T16:58:48.439Z",
          "__v": 0
        }
      },
      "statusCode": 201,
      "timestamp": "2025-06-20T16:58:48.444Z"
    }
    ```
  - `400/401/500` with error message

#### Change Shortened URL to a custom URL or Update a custom URL

- **PATCH** `/url/custom-url`
- **Authentication:** Cookie
- **Body:**
  ```json
  {
    "existingCode": "xxxxxx",
    "customCode": "google"
  }
  ```
- `customCode` must be atleast 6 characters long
- **Response:**
  - `200 OK` with shortened URL info
    ```json
    {
      "success": true,
      "message": "Custom Code attached successfully",
      "data": {
        "shortUrl": {
          "_id": "...",
          "user": "...",
          "longUrl": "https://www.google.com",
          "shortCode": "google",
          "visitCount": 0,
          "createdAt": "2025-06-20T16:55:52.757Z",
          "updatedAt": "2025-06-20T17:00:36.942Z",
          "__v": 0
        }
      },
      "statusCode": 200,
      "timestamp": "2025-06-20T17:00:36.952Z"
    }
    ```
  - `400/401/404/409/500` with error message

#### Get URL Stats

- **GET** `/url/stats`
- **Params** `shortCode=xxxxxx`
- **Authentication:** Cookie
- **Response:**
  - `200 OK` with URL stats
    ```json
    {
      "success": true,
      "message": "URL Stats sent Successfully",
      "data": {
        "shortUrl": {
          "_id": "...",
          "user": "...",
          "longUrl": "https://www.google.com",
          "shortCode": "google",
          "visitCount": 0,
          "createdAt": "2025-06-20T16:55:52.757Z",
          "updatedAt": "2025-06-20T17:00:36.942Z",
          "__v": 0
        }
      },
      "statusCode": 200,
      "timestamp": "2025-06-20T17:03:57.905Z"
    }
    ```
  - `400/401/404/500` with error message

#### Delete URL

- **DELETE** `/url/delete`
- **Params** `shortCode=xxxxxx`
- **Authentication:** Cookie
- **Response:**
  - `200 OK` with deletion result
    ```json
    {
      "success": true,
      "message": "URL Deleted Successfully",
      "data": {
        "deletedUrl": {
          "_id": "...",
          "user": "...",
          "longUrl": "https://www.google.com",
          "shortCode": "google",
          "visitCount": 0,
          "createdAt": "2025-06-20T16:55:52.757Z",
          "updatedAt": "2025-06-20T17:00:36.942Z",
          "__v": 0
        }
      },
      "statusCode": 200,
      "timestamp": "2025-06-20T17:04:36.912Z"
    }
    ```
  - `400/401/404/500` with error message

---

### Redirection

#### Redirect to Original URL

- **GET** `/:shortCode`
- **Description:** Redirects to the original URL if found, otherwise shows a not found page.

---

### Documentation

#### View API Documentation

- **GET** `/`
- **Description:** Opens the API Documentation for this URL Shortner

---

## Example Error Response Format

- `400`Bad Request -- Validation Error
- `401` Unauthorized
- `404` Not Found
- `409` Conflict
- `500` Internal Server Error

### Sample Error Response Format

```json
code = {
400: "BAD_REQUEST",
401: "UNAUTHORIZED",
404: "NOT_FOUND",
409: "CONFLICT",
500: "INTERNAL_SERVER_ERROR",
};
```

```json
{
  "success": false,
  "message": "...message...",
  "errorCode": "...code[statusCode]...",
  "statusCode": "...statusCode...",
  "timestamp": "...",
  "stack": "...Error Stack..."
}
```

- Stack will only be seen while on development mode (NODE_ENV=development)

## Authentication & Authorization

### 🔐 **Advanced Session Management**

- **Dual Token System**: Access tokens (short-lived) + Refresh tokens (long-lived)
- **Device Limit Control**: Configurable maximum concurrent sessions per user (default: 5)
- **Automatic Session Cleanup**: Expired tokens removed automatically for optimal performance
- **Secure Storage**: Tokens stored as HTTP-only cookies with proper security headers
- **Backward Compatible**: Seamless migration from old token formats

### 🛡️ **Security Features**

- **Password Security**: Bcrypt hashing with configurable salt rounds
- **Token Validation**: Cryptographic verification for authentication
- **Session Management**: Oldest sessions automatically removed when device limit exceeded
- **Error Handling**: Comprehensive error responses with proper HTTP status codes
- **CORS Protection**: Configurable cross-origin resource sharing

### 📱 **Multi-Device Support**

- Users can be logged in on up to `MAX_DEVICES` devices simultaneously
- When the limit is exceeded, the oldest session is automatically terminated
- Each session is tracked with creation timestamps
- Automatic cleanup of expired sessions maintains database efficiency

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
│ └── mongodb.config.js
├── controllers/
│ ├── url.controller.js
│ ├── user.controller.js
│ ├── auth.controller.js
│ └── redirect.controller.js
├── middleware/
│ ├── auth.middleware.js
│ └── errorHandler.middleware.js
├── models/
│ ├── url.model.js
│ └── user.model.js
├── routes/
│ ├── redirect.routes.js
│ ├── url.routes.js
│ ├── user.routes.js
│ └── auth.routes.js
├── services/
│ ├── auth.service.js
│ ├── url.service.js
│ └── user.service.js
├── public/
│ ├── images/
| │ ├── favicon.png
| │ ├── github.svg
| │ ├── linkedin.svg
| │ └── mail.svg
│ ├── javascripts/
| │ └── homepage.js
│ └── stylesheets/
|   ├── homepage.css
|   └── notfound.css
├── views/
│ ├── homepage.ejs
│ └── notfound.ejs
├── utils/
│ ├── appError.util.js
│ ├── catchAsync.util.js
│ ├── response.util.js
│ ├── nanoid6.util.js
│ ├── refreshTokenValidator.util.js
│ └── setCookie.util.js
└── ...

```

---

## 🚀 Performance & Optimization

### **High-Performance Authentication**

- **Token Validation**: Uses `jwt.decode()` for faster parsing vs `jwt.verify()`
- **Bulk Database Operations**: Efficient cleanup with `bulkWrite()` operations
- **Automatic Cleanup**: Expired tokens removed without manual intervention

### **Device Management**

- **Configurable Limits**: Set `MAX_DEVICES` environment variable (default: 5)
- **Automatic Session Management**: Oldest sessions removed when limit exceeded
- **Memory Efficient**: No token accumulation with automatic cleanup
- **Backward Compatible**: Handles migration from old token formats seamlessly

### **Database Optimization**

- **Indexed Fields**: Optimized queries with proper indexing
- **Bulk Operations**: Reduced database round trips
- **Efficient Cleanup**: Background token cleanup processes
- **Schema Evolution**: Smooth migration from string to object token storage

---

## Contributing

1. Fork the repository
2. Create your branch (`git checkout -b branchName`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin branchName`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

You are free to use, modify, and distribute this software for personal or commercial purposes, provided that proper credit is given to the original author.

© 2025 Neel Shah

---

## Contact / Credits

- **Author:** [Neel Shah](mailto:neelsshah2006@gmail.com)
- **Made with ❤️ by Neel Shah**

---

\*\*Feel free to open issues
