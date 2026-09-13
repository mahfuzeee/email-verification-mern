# Email Verification MERN Project

A full-stack authentication project that implements user registration, login, email verification via verification link, and OTP-based email verification using Express, MongoDB, Mongoose, Nodemailer, JWT, and a static HTML/CSS/JavaScript frontend.

## Project Overview

This repository implements a user account flow with:

- User registration with name, email, and password.
- Password hashing using `bcryptjs`.
- Email verification using a secure verification token link.
- OTP request and OTP verification flow for an alternate verification route.
- JWT-based login token generation.
- A static frontend experience with register, login, OTP, and success screens.

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication tokens
- bcryptjs for password and OTP hashing
- Nodemailer for sending emails
- HTML, CSS, vanilla JavaScript frontend

## Features

- Secure registration flow that prevents duplicate emails.
- Email verification link sent after registration.
- OTP generation and storage using hashed OTP values.
- OTP expiry handling.
- Login route that validates hashed password and returns a JWT.
- Frontend pages for registration, login, OTP request/verification, and a final success screen.
- Password strength UI in the registration page.
- Countdown and resend UI behavior for OTP requests.

## Project Structure

```text
email-verification-mern/
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── style.css
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   └── utils/
│       └── emailVerification.js
├── package.json
├── server.js
└── README.md
```

## Backend Flow

The Express server starts in `server.js` and mounts the authentication routes under `/api/auth`:

```js
app.use("/api/auth", authRoutes);
```

The route definitions in `src/routes/authRoutes.js` expose:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/verify/:token`
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`

## User Model

The MongoDB model in `src/models/User.js` stores:

- `name`
- `email` with unique constraint
- `password`
- `isVerified`
- `verificationToken`
- `verificationExpiresAt`
- `otpHashed`
- `otpExpiry`

## Email Verification Utilities

The file `src/utils/emailVerification.js` creates a Nodemailer transport using Gmail SMTP and defines two email helpers:

- `sendVerificationEmail(user)`
  - Generates a random token.
  - Saves the token and expiry date on the user.
  - Sends a clickable verification link.

- `sendOTPEmail(user)`
  - Generates a 6-digit OTP.
  - Hashes the OTP before storing it.
  - Sends the OTP to the user’s email.

## Controllers

The controller in `src/controllers/authController.js` handles:

- `register`
  - Checks for duplicate email.
  - Hashes password.
  - Creates new user.
  - Sends verification email.
  - Returns a JWT token.

- `login`
  - Finds user by email.
  - Compares the incoming password with the stored hash.
  - Returns a JWT if validation succeeds.

- `verifyByEmail`
  - Validates token and expiry date.
  - Marks the user as verified.
  - Clears verification token and expiry field.

- `sendOTP`
  - Validates that the user exists and is not already verified.
  - Sends an OTP email.

- `verifyOTP`
  - Finds the user by email.
  - Checks OTP expiry.
  - Compares the OTP hash.
  - Marks the account verified and clears OTP storage.

## Frontend

The static frontend files in `frontend/` provide a complete UI:

- Register page
- Login page
- OTP verification page
- Success page

The frontend uses `fetch()` to call a local Express backend at:

```js
const BASE = "http://localhost:3000";
```

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
PORT=3000
MONGO_URI_LOCAL=mongodb://127.0.0.1:27017/email-verification
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

Important:

- Replace the Gmail credentials with your own email account credentials.
- Use an App Password for Gmail if 2-Step Verification is enabled.
- `MONGO_URI_LOCAL` should match your MongoDB database.

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file using the sample values above.
4. Start the backend:

```bash
npm run dev
```

5. Open the frontend static HTML file with your browser or serve it through a local static server if needed.

## Running the Project

Start the Express server:

```bash
npm start
```

For development with live reload:

```bash
npm run dev
```

## API Summary

| Method | Endpoint                  | Description                                       |
| ------ | ------------------------- | ------------------------------------------------- |
| POST   | `/api/auth/register`      | Register a new user and send a verification email |
| POST   | `/api/auth/login`         | Login a user and return a JWT                     |
| GET    | `/api/auth/verify/:token` | Verify the email account with a token             |
| POST   | `/api/auth/request-otp`   | Request a one-time password by email              |
| POST   | `/api/auth/verify-otp`    | Verify the OTP and mark the account verified      |

## Notes

- The server uses `cors()` to allow frontend requests from local origin during development.
- The email verification link uses the backend base URL as `http://localhost:3000`.
- The OTP expiry is set to 10 minutes in `sendOTPEmail()`.
- The verification token expiry is set to 24 hours when the verification email is sent.

## License

This project is licensed under the ISC License.
