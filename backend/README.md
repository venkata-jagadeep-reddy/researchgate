# Neurodiversity Learning Hub - Backend

The backend API for the Neurodiversity Learning Hub, providing authentication, user management, and game score tracking.

## Features

- User authentication with JWT
- Secure password hashing with bcrypt
- MongoDB database for user data and game scores
- RESTful API endpoints
- Input validation
- CORS support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/neurodiversity-hub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
FRONTEND_URL=http://localhost:5500
```

3. Start MongoDB:
```bash
# If using local MongoDB
mongod
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. The API will be available at:
```
http://localhost:3000/api
```

## Project Structure

- `server.js` - Main application file
- `config/` - Configuration files
  - `db.js` - Database connection
- `controllers/` - Request handlers
  - `authController.js` - Authentication logic
  - `scoreController.js` - Game score logic
- `middlewares/` - Middleware functions
  - `auth.js` - JWT authentication
  - `validation.js` - Input validation
- `models/` - Database models
  - `User.js` - User schema
- `routes/` - API routes
  - `authRoutes.js` - Authentication routes
  - `scoreRoutes.js` - Game score routes

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Game Scores
- `POST /api/scores` - Save a game score (requires authentication)
- `GET /api/scores` - Get user's game scores (requires authentication)

### Health Check
- `GET /api/health` - Check if the server is running

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Input validation using express-validator
- CORS enabled with configurable origins
- Environment variables for sensitive data

## Development

To modify the backend:

1. Update the models to change the database schema
2. Modify controllers to change business logic
3. Update routes to add or modify API endpoints
4. Add new middleware as needed

## Deployment

For production deployment:

1. Set up a MongoDB database (Atlas recommended)
2. Configure environment variables for production
3. Deploy to a Node.js hosting service (Heroku, AWS, etc.)
4. Update the frontend API configuration to point to the production backend 