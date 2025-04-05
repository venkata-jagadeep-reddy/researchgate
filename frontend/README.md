# Neurodiversity Learning Hub - Frontend

The frontend application for the Neurodiversity Learning Hub, featuring interactive games, progress tracking, and personalized learning experiences.

## Features

- User authentication (login/register)
- Interactive learning games
- Progress tracking
- Dark mode support
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:5500
```

## Project Structure

- `index.html` - Main dashboard page
- `auth.html` - Authentication page (login/register)
- `get-started.html` - Introduction page
- `styles.css` - Global styles
- `script.js` - Global scripts
- `js/` - JavaScript modules
  - `config.js` - API configuration
  - `main.js` - API functions

## API Integration

The frontend communicates with the backend API using the following endpoints:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/scores` - Save a game score
- `GET /api/scores` - Get user's game scores

## Development

To modify the frontend:

1. Edit the HTML files to change the structure
2. Modify `styles.css` to update the styling
3. Update the JavaScript modules in the `js/` directory to change functionality

## Deployment

For production deployment:

1. Build the application (if using a build tool)
2. Deploy the static files to a web server
3. Update the API endpoints in `js/config.js` to point to the production backend 