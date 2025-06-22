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
- [Performance & Optimization](#performance--optimization)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact / Credits](#contact--credits)

---

## Features

- **User Registration & Authentication** (JWT, OAuth, HTTP-only cookies)
- **Advanced Session Management**: Configurable device/session limits, automatic cleanup
- **Secure Password Hashing**: Bcrypt with configurable salt rounds
- **OAuth2.0 Authentication**: Google OAuth2.0 for easy sign-in
- **Token Validation**: Fast JWT parsing and verification
- **Automatic Cleanup**: Expired tokens and sessions are removed automatically
- **Database Optimization**: Indexed fields, efficient queries, and schema evolution support
- **URL Shortening**: Unique and custom short codes
- **URL Safety Check**: Checks if the URL is safe using Google Safe Browsing API before creating short URL
- **Redirection & Analytics**: Track visits, device info, and timestamps
- **User Profile Management**: Update profile, change password
- **User-Specific Link Management**: List, update, and delete links
- **Link Statistics**: Get detailed stats for each link
- **Automatic Token Cleanup**: Expired tokens removed automatically
- **Comprehensive Error Handling**: Consistent, structured error responses
- **CORS Protection**: Configurable cross-origin resource sharing

---

## Technology Stack

- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, bcrypt, Google OAuth
- **Templating:** EJS
- **Validation:** express-validator
- **Caching:** lru-cache
- **Security:** helmet, cookie-parser, cors
- **Analytics:** ua-parser-js, request-ip
- **Other:** dotenv, morgan, axios, crypto

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
MONGO_URL="mongodb://127.0.0.1:27017/url_shortener"
ROUNDS=15
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:5000"
MAX_DEVICES=5
ACCESS_TOKEN_SECRET="your_access_token_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"
GOOGLE_SAFE_BROWSING_API_KEY=your_google_api_key
GOOGLE_SAFE_BROWSING_CLIENT_ID=client_id
GOOGLE_SAFE_BROWSING_CLIENT_VERSION=client_version
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_oauth_client_secret
```

| Variable                            | Description                                               | Example               |
| ----------------------------------- | --------------------------------------------------------- | --------------------- |
| PORT                                | Port to run the server on                                 | 5000                  |
| MONGO_URL                           | MongoDB connection string                                 |                       |
| ROUNDS                              | Bcrypt salt rounds for password hash                      | 15                    |
| NODE_ENV                            | Environment (development/production)                      | development           |
| FRONTEND_URL                        | Allowed frontend origin for CORS (optional)               | http://localhost:5173 |
| BACKEND_URL                         | Your Backend URL for Google OAuth callback                | http://localhost:5000 |
| MAX_DEVICES                         | Maximum concurrent devices per user                       | 5(Default)            |
| ACCESS_TOKEN_SECRET                 | Secret key for access token signing                       |                       |
| REFRESH_TOKEN_SECRET                | Secret key for refresh token signing                      |                       |
| ACCESS_TOKEN_EXPIRY                 | Access token expiration time                              | 15m                   |
| REFRESH_TOKEN_EXPIRY                | Refresh token expiration time                             | 7d                    |
| GOOGLE_SAFE_BROWSING_API_KEY        | Your Google Console API key with SafeBrowsing API Enabled |                       |
| GOOGLE_SAFE_BROWSING_CLIENT_ID      | Google Client Id                                          |                       |
| GOOGLE_SAFE_BROWSING_CLIENT_VERSION | Google Client Version                                     |                       |
| GOOGLE_OAUTH_CLIENT_ID              | Google OAuth Client ID                                    |                       |
| GOOGLE_OAUTH_CLIENT_SECRET          | Google OAuth Client Secret                                |                       |

> See `.env.example` for a template.

> **Note:**
>
> - `GOOGLE_SAFE_BROWSING_API_KEY` , `GOOGLE_SAFE_BROWSING_CLIENT_ID` and `GOOGLE_SAFE_BROWSING_CLIENT_VERSION` are optional, if not provided, the API will not check if the longUrl is malicious or not and will continue to generate short URL.
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

- **POST** `/auth/local/register`
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
        "lastName": "Shah"
      },
      "username": "neelsshah2006",
      "email": "neelsshah2006@gmail.com",
      "authProvider": "local",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "statusCode": 201,
    "timestamp": "..."
  }
  ```

#### Login

- **POST** `/auth/local/register`
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
        "lastName": "Shah"
      },
      "username": "neelsshah2006",
      "email": "neelsshah2006@gmail.com",
      "authProvider": "local",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "statusCode": 200,
    "timestamp": "..."
  }
  ```

#### Google OAuth

- **GET** `/auth/oauth/google` – Redirects to Google for authentication.
- **GET** `/auth/oauth/google/callback` – Handles Google callback.

#### Logout

- **GET** `/auth/logout`
- **Authentication:** Cookie
- **Description:** Logs out user and removes refresh token from active sessions.
- **Note:** This endpoint can be used to logout from both Local and OAuth sessions.
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
          "lastName": "Shah"
        },
        "username": "neelsshah2006",
        "email": "neelsshah2006@gmail.com",
        "authProvider": "local",
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
          "lastName": "Shah"
        },
        "username": "mokshshah",
        "email": "neelsshah2006@gmail.com",
        "authProvider": "local",
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
          "lastName": "Shah"
        },
        "username": "mokshshah",
        "email": "neelsshah2006@gmail.com",
        "authProvider": "local",
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
        "_id": "...",
        "user": "...",
        "longUrl": "https://example.com",
        "shortCode": "xxxxxx",
        "visitCount": 0,
        "createdAt": "...",
        "updatedAt": "..."
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
        "updatedAt": "..."
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
        "shortCode": "example",
        "visitCount": 3,
        "createdAt": "2025-06-22T15:29:20.419Z",
        "updatedAt": "2025-06-22T15:31:46.073Z",
        "__v": 0
      },
      "clicks": [
        {
          "_id": "...",
          "url": "...",
          "continent": "Asia",
          "country": "India",
          "state": "Maharashtra",
          "city": "Mumbai",
          "location": {
            "ltd": 18.95,
            "lng": 72.83
          },
          "browser": "Chrome",
          "os": "Windows",
          "device": "desktop",
          "createdAt": "2025-06-22T15:31:36.527Z",
          "updatedAt": "2025-06-22T15:31:36.527Z",
          "__v": 0
        },
        {
          "_id": "...",
          "url": "...",
          "continent": "Asia",
          "country": "India",
          "state": "Gujarat",
          "city": "Surat",
          "location": {
            "ltd": 21.17,
            "lng": 72.83
          },
          "browser": "Edge",
          "os": "Android",
          "device": "mobile",
          "createdAt": "...",
          "updatedAt": "...",
          "__v": 0
        },
        {
          "_id": "...",
          "url": "...",
          "continent": "Asia",
          "country": "India",
          "state": "Gujarat",
          "city": "Ahmedabad",
          "location": {
            "ltd": 23.0,
            "lng": 72.57
          },
          "browser": "Safari",
          "os": "ios",
          "device": "iPad",
          "createdAt": "...",
          "updatedAt": "..."
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
        "shortCode": "example",
        "visitCount": 3,
        "createdAt": "...",
        "updatedAt": "..."
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
- **Token Expiry:** Access tokens expire after `ACCESS_TOKEN_EXPIRY`, refresh tokens after `REFRESH_TOKEN_EXPIRY` days.
- **Session/Device Limit:** Configurable via `MAX_DEVICES` (default: 5). Oldest sessions are removed when limit is exceeded.
- **Logout:** Logs out user and removes refresh token from active sessions.
- **OAuth2.0:** Google OAuth2.0 for easy sign-in.
- **Passwordless Login:** Users can login with just their email (if they have a Google account associated with it).
- **Automatic Token Cleanup:** Expired tokens are removed automatically.
- **Password Security:** Bcrypt hashing with configurable salt rounds.
- **CORS:** If `FRONTEND_URL` is set, only requests from that origin are allowed.

---

## Performance & Optimization

- **Token Validation:** Fast JWT parsing and verification
- **Caching:** In-memory caching for frequently accessed data
- **Bulk Database Operations:** Efficient cleanup with `bulkWrite()`
- **Automatic Cleanup:** Expired tokens and sessions are removed automatically
- **Device Management:** Configurable session limits, automatic session removal
- **Database Optimization:** Indexed fields, efficient queries, and schema evolution support

---

## Folder Structure

```
url_shortner_api/
├── server.js
├── app.js
├── .env
├── package.json
├── config/
│   ├── mongodb.config.js
│   └── passport.config.js
├── controllers/
│   ├── url.controller.js
│   ├── user.controller.js
│   ├── localAuth.controller.js
│   ├── oAuth.controller.js
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
│   ├── auth.routes.js
│   ├── localAuth.routes.js
│   └── oAuth.routes.js
├── services/
│   ├── localAuth.service.js
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
│   ├── checkUrlSafety.util.js
│   └── UAParser.util.js
└── ...
```

---

## Contributing

1. Fork the repository
2. Create your branch (`git checkout -b branchName`)
3. Commit your changes (`git commit -m 'Add new feature'`)
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

**Feel free to open issues or contribute!**
