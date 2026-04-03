# YouTube Clone Backend

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](./package.json)
[![Build Status](https://img.shields.io/badge/build-not_configured-lightgrey)](#setup-instructions)
[![License](https://img.shields.io/badge/license-ISC-green)](./package.json)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](#prerequisites)

A Node.js, Express, and MongoDB backend for a YouTube-style application with user authentication, JWT-based session handling, avatar and cover image uploads, and Cloudinary media storage.

## Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [License](#license)
- [Contributing](#contributing)

## About

This project provides the backend foundation for a YouTube clone application. It focuses on user account management and authentication workflows, including registration, login, logout, refresh-token rotation, image upload handling, and secure token-based session management using HTTP-only cookies.

The backend is organized using a modular Express architecture with separate layers for routes, controllers, models, middleware, database connection, and utility helpers.

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for multipart file uploads
- Cloudinary for media storage
- Cookie Parser
- CORS

## Key Features

- User registration with avatar and optional cover image upload
- Secure login with access token and refresh token
- Refresh-token based session renewal
- Logout with cookie cleanup and refresh token invalidation
- Password hashing using `bcrypt`
- MongoDB schema-based data modeling with Mongoose
- Cloudinary integration for asset storage
- Modular backend folder structure for scalability

## Prerequisites

Make sure the following tools and services are available before running the project:

- Node.js `18+` recommended
- `npm` or another Node package manager
- MongoDB database connection string
- Cloudinary account for media upload support
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd "Youtube Clone"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create the Environment File

Create a `.env` file in the project root and add the required variables:

```env
PORT=8000
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_strong_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_strong_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Start the Development Server

```bash
npm run dev
```

The API will start on:

```text
http://localhost:<PORT>
```

## Environment Variables

The application reads its configuration from the root `.env` file.

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `PORT` | Yes | `8000` | Port used by the Express server. |
| `MONGODB_URL` | Yes | `mongodb+srv://user:pass@cluster/db` | Full MongoDB connection string used by Mongoose. |
| `CORS_ORIGIN` | Yes | `http://localhost:3000` | Frontend origin allowed to make cross-origin requests with credentials. |
| `ACCESS_TOKEN_SECRET` | Yes | `super_secret_access_key` | Secret used to sign access tokens. Use a long random string in production. |
| `ACCESS_TOKEN_EXPIRY` | Yes | `1d` | Access token lifetime passed to JWT, such as `15m`, `1h`, or `1d`. |
| `REFRESH_TOKEN_SECRET` | Yes | `super_secret_refresh_key` | Secret used to sign refresh tokens. Keep it different from the access token secret. |
| `REFRESH_TOKEN_EXPIRY` | Yes | `10d` | Refresh token lifetime passed to JWT. |
| `CLOUDINARY_CLOUD_NAME` | Yes | `my-cloud-name` | Cloudinary cloud name used for media uploads. |
| `CLOUDINARY_API_KEY` | Yes | `123456789012345` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Yes | `cloudinary_secret_value` | Cloudinary API secret. Never commit this value. |

## API Documentation

Base URL:

```text
http://localhost:<PORT>/api/v1/user
```

### 1. Register User

- Method: `POST`
- Route: `/register`
- Auth Required: `No`
- Content-Type: `multipart/form-data`

#### Request Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `fullName` | `string` | Yes | Full name of the user |
| `email` | `string` | Yes | Must be a valid Gmail address |
| `username` | `string` | Yes | Unique username |
| `password` | `string` | Yes | User password |
| `avatar` | `file` | Yes | Profile image |
| `coverImage` | `file` | No | Cover image |

#### Example Response

```json
{
  "data": {
    "_id": "67cabc1234567890abcdef12",
    "username": "ritesh",
    "email": "ritesh@gmail.com",
    "fullName": "Ritesh Tyagi",
    "avatar": {
      "url": "https://res.cloudinary.com/demo/image/upload/avatar.jpg",
      "publicId": "avatar_public_id"
    },
    "coverImage": {
      "url": "https://res.cloudinary.com/demo/image/upload/cover.jpg",
      "publicId": "cover_public_id"
    },
    "watchHistory": [],
    "createdAt": "2026-04-03T10:00:00.000Z",
    "updatedAt": "2026-04-03T10:00:00.000Z"
  },
  "statusCode": 201,
  "message": "User registered successfully",
  "success": true
}
```

### 2. Login User

- Method: `POST`
- Route: `/login`
- Auth Required: `No`
- Content-Type: `application/json`

#### Request Body

```json
{
  "email": "ritesh@gmail.com",
  "password": "your_password"
}
```

You can also log in with `username` instead of `email`.

#### Example Response

```json
{
  "data": {
    "user": {
      "_id": "67cabc1234567890abcdef12",
      "username": "ritesh",
      "email": "ritesh@gmail.com",
      "fullName": "Ritesh Tyagi"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "statusCode": 200,
  "message": "User loggedIn successfully",
  "success": true
}
```

### 3. Logout User

- Method: `POST`
- Route: `/logout`
- Auth Required: `Yes`
- Content-Type: `application/json`

#### Auth Header

```http
Authorization: Bearer <access_token>
```

The route also supports access token lookup from cookies.

#### Example Response

```json
{
  "data": {},
  "statusCode": 200,
  "message": "User loggedout",
  "success": true
}
```

### 4. Refresh Access Token

- Method: `POST`
- Route: `/refresh-token`
- Auth Required: `No`
- Content-Type: `application/json`

#### Request Body

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

The refresh token may also be supplied through cookies.

#### Example Response

```json
{
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  },
  "statusCode": 200,
  "message": "Access token refreshed",
  "success": true
}
```

## Project Structure

```text
Youtube Clone/
|-- public/
|   `-- assets/
|-- src/
|   |-- controllers/
|   |   `-- user.controllers.js
|   |-- db/
|   |   `-- index.js
|   |-- middlewares/
|   |   |-- autho.middlewares.js
|   |   `-- multer.middlewares.js
|   |-- models/
|   |   |-- subscription.models.js
|   |   |-- user.models.js
|   |   `-- video.models.js
|   |-- routes/
|   |   `-- user.routes.js
|   |-- utils/
|   |   |-- apiErrors.js
|   |   |-- apiResponse.js
|   |   |-- asyncHandler.js
|   |   |-- cloudinary.js
|   |   `-- isgmail.js
|   |-- app.js
|   |-- constants.js
|   `-- index.js
|-- .env
|-- .gitignore
|-- package.json
|-- package-lock.json
`-- Readme.md
```

## Error Handling

The project defines a custom `apiError` class for structured application errors and an `apiResponse` class for successful responses.

### Success Response Format

```json
{
  "data": {},
  "statusCode": 200,
  "message": "Success message",
  "success": true
}
```

### Error Object Shape Used in the Codebase

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false,
  "errors": []
}
```

### Common Status Codes

- `400` Bad Request
- `401` Unauthorized
- `404` Not Found
- `409` Conflict
- `500` Internal Server Error

### Important Note

Controllers and middleware throw `apiError`, but there is currently no centralized Express error-handling middleware registered in [src/app.js](c:\myLearnings\Wev-devlopment\X-BackEnd_Dev\Y-Projects\Youtube Clone\src\app.js). That means production-grade, fully standardized error responses are not yet guaranteed for every failure path. Adding a dedicated global error handler would be a strong next improvement.

## License

This project is licensed under the `ISC` License.
