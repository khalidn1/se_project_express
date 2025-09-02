# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You'll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling tool
- **JWT (JSON Web Tokens)** - User authentication and authorization
- **bcryptjs** - Password hashing
- **validator** - Data validation
- **CORS** - Cross-origin resource sharing
- **ESLint** - Code linting tool
- **Prettier** - Code formatter
- **Nodemon** - Development server with hot reload

## Core Features & API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /signin` - User login (returns JWT token)

### User Management (Protected)
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update current user profile

### Clothing Items
- `GET /items` - Get all clothing items (public)
- `POST /items` - Create a new clothing item (protected)
- `DELETE /items/:itemId` - Delete a clothing item (protected, owner only)

### Likes System (Protected)
- `PUT /items/:itemId/likes` - Like a clothing item
- `DELETE /items/:itemId/likes` - Remove like from a clothing item

## Project Structure
```
├── controllers/          # Route controllers
│   ├── users.js         # User-related logic
│   └── clothingItems.js # Clothing item logic
├── middlewares/         # Custom middleware
│   └── auth.js          # JWT authentication middleware
├── models/              # Database schemas
│   ├── user.js          # User model
│   └── clothingItem.js  # Clothing item model
├── routes/              # API routes
│   ├── index.js         # Main router
│   ├── users.js         # User routes
│   └── clothingItems.js # Item routes
├── utils/               # Utility functions
│   ├── errors.js        # Error constants
│   └── config.js        # Configuration settings
├── app.js               # Application entry point
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation