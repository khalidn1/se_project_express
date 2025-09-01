# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You'll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling tool
- **ESLint** - Code linting tool
- **Prettier** - Code formatter
- **Nodemon** - Development server with hot reload

## Core Features & API Endpoints

### User Management
- `GET /users` - Get all users
- `GET /users/:userId` - Get user by ID
- `POST /users` - Create a new user

### Clothing Items
- `GET /items` - Get all clothing items
- `POST /items` - Create a new clothing item
- `DELETE /items/:itemId` - Delete a clothing item

### Likes System
- `PUT /items/:itemId/likes` - Like a clothing item
- `DELETE /items/:itemId/likes` - Remove like from a clothing item

## Data Models

### User Schema
```javascript
{
  name: String (required, 2-30 characters),
  avatar: String (required, valid URL)
}
```

### Clothing Item Schema
```javascript
{
  name: String (required, 2-30 characters),
  weather: String (required, enum: 'hot', 'warm', 'cold'),
  imageUrl: String (required, valid URL),
  owner: ObjectId (required, reference to User),
  likes: [ObjectId] (array of User references),
  createdAt: Date (default: Date.now)
}
```

## Running the Project

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Launches the server with hot reload on port **3001**

### Production
```bash
npm run start
```
Launches the server on port **3001**

### Linting
```bash
npm run lint
```
Checks code for linting errors

```bash
npm run lint -- --fix
```
Automatically fixes linting errors

## Environment Setup

1. **MongoDB Connection**: The server connects to `mongodb://127.0.0.1:27017/wtwr_db`
2. **Port**: Server runs on port 3001 (configurable via PORT environment variable)
3. **Temporary Authorization**: Currently uses hardcoded user ID for development

## Error Handling

The API includes comprehensive error handling for:
- **400** - Invalid data or malformed requests
- **404** - Resource not found
- **500** - Internal server errors


## Project Structure
```
├── controllers/          # Route controllers
│   ├── users.js         # User-related logic
│   └── clothingItems.js # Clothing item logic
├── models/              # Database schemas
│   ├── user.js          # User model
│   └── clothingItem.js  # Clothing item model
├── routes/              # API routes
│   ├── index.js         # Main router
│   ├── users.js         # User routes
│   └── clothingItems.js # Item routes
├── utils/               # Utility functions
│   └── errors.js        # Error constants
├── app.js               # Application entry point
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation