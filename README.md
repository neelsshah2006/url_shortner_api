# URL Shortener API

A minimal and efficient RESTful API for shortening URLs. This backend service allows users to register, authenticate, create, manage, and track shortened links with robust authentication and statistics.

---

## Features

- User registration and authentication (JWT & cookies)
- Secure password hashing
- URL shortening with unique short codes
- Redirection to original URLs
- URL statistics (visit count, creation date)
- User profile management
- User-specific link management
- Token blacklisting for secure logout
- Clean API documentation and error handling

---

## Technology Stack

- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, bcrypt
- **Templating:** EJS
- **Validation:** express-validator
- **Other:** dotenv, cookie-parser, morgan, cors

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
JWT_SECRET=your_jwt_secret
ROUNDS=15
FRONTEND_URL=your_frontend_website_url
```

| Variable     | Description                          |
| ------------ | ------------------------------------ |
| PORT         | Port to run the server on            |
| MONGO_URL    | MongoDB connection string            |
| JWT_SECRET   | Secret key for JWT signing           |
| ROUNDS       | Bcrypt salt rounds for password hash |
| FRONTEND_URL | Your Frontend Website URL (Optional) |

FRONTEND_URL is an optional environment variable. If not provided, API will accept responses from all websites

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

- **POST** `/user/register`
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
        "token": "...JWT_Token...",
        "user": {
          "fullName": {
            "firstName": "Neel",
            "lastName": "Shah",
            "_id": "..."
          },
          "username": "neelsshah2006",
          "email": "neelsshah2006@gmail.com",
          "links": [],
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
  - `400/409/500` with error message

#### Login

- **POST** `/user/login`
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
        "token": "...JWT_Token...",
        "user": {
          "_id": "...",
          "fullName": {
            "firstName": "Neel",
            "lastName": "Shah",
            "_id": "..."
          },
          "username": "neelsshah2006",
          "email": "neelsshah2006@gmail.com",
          "links": ["...", "..."],
          "createdAt": "...",
          "updatedAt": "...",
          "__v": 0
        }
      },
      "statusCode": 200,
      "timestamp": "..."
    }
    ```
  - `400/401/404/500` with error message

#### Logout

- **GET** `/user/logout`
- **Headers:** `Authorization: Bearer <token>` or cookie
- **Description:** Logs out user and blacklists token.
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
- **Headers:** `Authorization: Bearer <token>` or cookie
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
          "links": ["...", "..."], // ID of the links generated by the user from the URL Database
          "createdAt": "...",
          "updatedAt": "...",
          "__v": 0
        }
      },
      "statusCode": 200,
      "timestamp": "2025-06-16T12:23:08.270Z"
    }
    ```
  - `401/500` with error message

#### Update Profile

- **PATCH** `/user/update-profile`
- **Headers:** `Authorization: Bearer <token>` or cookie
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
          "links": ["...", "..."],
          "createdAt": "...",
          "updatedAt": "...",
          "__v": 0
        }
      },
      "statusCode": 200,
      "timestamp": "..."
    }
    ```
  - `400/401/500` with error message

#### Change Password

- **PATCH** `/user/change-password`
- **Headers:** `Authorization: Bearer <token>` or cookie
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
          "links": ["...", "..."],
          "createdAt": "...",
          "updatedAt": "...",
          "__v": 0
        }
      },
      "statusCode": 200,
      "timestamp": "..."
    }
    ```
  - `400/401/500` with error message

#### Get User Links

- **GET** `/user/get-links`
- **Headers:** `Authorization: Bearer <token>` or cookie
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
            "longUrl": "https://www.google.com",
            "shortCode": "xxxxxx",
            "visitCount": 7,
            "createdAt": "..."
          },
          {
            "_id": "...",
            "longUrl": "https://example.com",
            "shortCode": "xxxxxx",
            "visitCount": 2,
            "createdAt": "..."
          }
        ]
      },
      "statusCode": 200,
      "timestamp": "2025-06-16T12:35:10.937Z"
    }
    ```
  - `401/500` with error message

---

### URL

#### Shorten URL

- **POST** `/url/shorten`
- **Headers:** `Authorization: Bearer <token>` or cookie
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
          "user": "...User_ID...", //ID of User who created this shortlink
          "longUrl": "https://example.com",
          "shortCode": "xxxxxx", //6 digit shortCode
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
  - `400/401/500` with error message

#### Get URL Stats

- **GET** `/url/stats`
- **Params** `shortCode=xxxxxx`
- **Headers:** `Authorization: Bearer <token>` or cookie
- **Response:**
  - `200 OK` with URL stats
    ```json
    {
      "success": true,
      "message": "URL Stats sent Successfully",
      "data": {
        "shortUrl": {
          "_id": "...",
          "user": "...User_ID..",
          "longUrl": "https://example.com",
          "shortCode": "xxxxxx",
          "visitCount": 10,
          "createdAt": "...",
          "updatedAt": "...",
          "__v": 0
        }
      },
      "statusCode": 200,
      "timestamp": "..."
    }
    ```
  - `400/401/404/500` with error message

#### Delete URL

- **DELETE** `/url/delete`
- **Params** `shortCode=xxxxxx`
- **Headers:** `Authorization: Bearer <token>` or cookie
- **Response:**
  - `200 OK` with deletion result
    ```json
    {
      "success": true,
      "message": "URL Deleted Successfully",
      "data": {
        "deletedUrl": {
          "_id": "...",
          "user": "...User_ID...",
          "longUrl": "https://example.com",
          "shortCode": "xxxxxx",
          "visitCount": 10,
          "createdAt": "...",
          "updatedAt": "...",
          "__v": 0
        }
      },
      "statusCode": 200,
      "timestamp": "..."
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

code = {
400: "BAD_REQUEST",
401: "UNAUTHORIZED",
404: "NOT_FOUND",
409: "CONFLICT",
500: "INTERNAL_SERVER_ERROR",
};

```json
{
  "success": false,
  "message": "...message...",
  "error": {
    "code": "...code[statusCode]...",
    "details": "...error_details..."
  },
  "statusCode": "...statusCode...",
  "timestamp": "..."
}
```

## Authentication & Authorization

- **JWT** tokens are issued on registration/login and stored as HTTP-only cookies.
- Tokens must be sent via `Authorization: Bearer <token>` or cookie header or as a cookie for protected endpoints.
- Logout blacklists the token for 24 hours.
- Passwords are securely hashed with bcrypt.

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
│ └── user.controller.js
├── middleware/
│ └── auth.middleware.js
├── models/
│ ├── blacklist.model.js
│ ├── url.model.js
│ └── user.model.js
├── routes/
│ ├── redirect.routes.js
│ ├── url.routes.js
│ └── user.routes.js
├── services/
│ ├── url.service.js
│ └── user.service.js
├── public/
│ ├── images/
| │ └── favicon.png
│ ├── javascripts/
| │ └── homepage.js
│ └── stylesheets/
|   ├── homepage.css
|   └── notfound.css
├── views/
│ ├── homepage.ejs
│ └── notfound.ejs
├── utils/
│ ├── response.util.js
│ └── setCookie.util.js
└── ...

```

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
