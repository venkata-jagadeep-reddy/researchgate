# Neurodiversity Learning Hub

A comprehensive learning platform designed for neurodiverse individuals, featuring interactive games, progress tracking, and personalized learning experiences.

## Project Structure

This project is organized into two main components:

### Frontend (`/frontend`)
- HTML, CSS, and JavaScript for the user interface
- Responsive design with dark mode support
- Interactive learning games
- User authentication and profile management

### Backend (`/backend`)
- Node.js/Express API server
- MongoDB database for user data and game scores
- JWT authentication and bcrypt password hashing
- RESTful API endpoints

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd neurodiversity-learning-hub
```

2. Install all dependencies (frontend, backend, and root):
```bash
npm run install:all
```

3. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/neurodiversity-hub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
FRONTEND_URL=http://localhost:5500
```

### Running the Application

#### Option 1: Run both frontend and backend together
```bash
npm start
```

#### Option 2: Run frontend and backend separately

1. Start the backend:
```bash
cd backend
npm run dev
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

3. Access the application:
- Frontend: http://localhost:5500
- Backend API: http://localhost:3000/api

## Development

### Frontend Development
- Edit HTML files in the `/frontend` directory
- Modify styles in `frontend/styles.css`
- Update JavaScript modules in `frontend/js/`

### Backend Development
- Modify API endpoints in `/backend/routes`
- Update business logic in `/backend/controllers`
- Change database schema in `/backend/models`

## Deployment

### Frontend Deployment
1. Build the application (if using a build tool)
2. Deploy the static files to a web server
3. Update the API endpoints in `frontend/js/config.js`

### Backend Deployment
1. Set up a MongoDB database (Atlas recommended)
2. Configure environment variables for production
3. Deploy to a Node.js hosting service (Heroku, AWS, etc.)

## Features

- User authentication with JWT
- Secure password hashing with bcrypt
- MongoDB database for user data and game scores
- Interactive learning games
- Progress tracking
- Dark mode support
- Responsive design

## License

This project is licensed under the MIT License - see the LICENSE file for details.