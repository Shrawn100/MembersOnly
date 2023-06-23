# membersOnly

A messageboard application built with Express.js, MongoDB, and Pug for views. It includes user authentication and authorization using Passport, with password encryption for enhanced security.

## Features

- User Registration and Login: Users can create an account and log in to the application.
- Password Encryption: User passwords are securely encrypted using bcrypt.
- Authorization: Only authenticated users can create and view author and date on message posts.
- Posting Messages: Authenticated users can create and publish message posts.
- View Messages: Users can view all published message posts on the home page.

## Installation

To run the "membersOnly" application locally, follow these steps:

1. Clone the repository: `git clone <repository_url>`
2. Install the dependencies: `npm install`
3. Set up environment variables: Create a `.env` file in the root directory and provide the necessary environment variables (e.g., MongoDB connection URI, session secret).
4. Start the application: `npm start`

Make sure you have Node.js and MongoDB installed on your machine.

## Technologies Used

- Express.js: Backend framework for building the application and handling HTTP requests.
- MongoDB: NoSQL database for storing user information and message posts.
- Pug: Template engine for rendering views.
- Passport: Authentication middleware for Express.js.
- bcrypt: Library for password encryption.
- express-session: Middleware for managing user sessions.
- express-validator: Middleware for validating user input.
- luxon: Library for working with dates and times.

## License

This project is licensed under the MIT License. Feel free to use and modify it according to your needs.


