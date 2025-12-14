# IoT Device Controller Backend Service

A production-ready, minimal backend service for IoT device management built with Node.js and Express.

## Features

- 🔐 Firebase Authentication (Phone OTP)
- 🗄️ Supabase Database Integration
- 🛡️ Security Middleware (Helmet, CORS, Rate Limiting)
- 📝 Structured Logging (Winston)
- ✅ Input Validation Ready
- 🏗️ Clean Architecture with Separation of Concerns
- 🚀 Production Ready with Graceful Shutdown

## Project Structure

```
src/
├── configs/          # External services & app configs
├── routes/           # Route definitions only
├── controllers/      # Request/Response handlers
├── services/         # Business logic & database operations
├── middlewares/      # Express middlewares
├── utils/            # Helper functions
├── validations/      # Input validation schemas
├── constants/        # App constants
├── jobs/             # Cron jobs
├── app.js            # Express app configuration
├── server.js         # Server startup (moved to root)
└── routes.js         # Route loader
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project
- Firebase project with Admin SDK credentials

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   SUPABASE_URL=your_supabase_url
   SUPABASE_API_KEY=your_supabase_api_key
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=*
   ```

4. Add Firebase service account credentials:
   - Place your Firebase service account JSON file at `firebase/serviceAccount.json`

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with Firebase token

### Users
- `GET /api/users/:userId` - Get user details

### Subscriptions
- `GET /api/subscriptions/status` - Get subscription status

### Devices
- `GET /api/devices/:deviceId` - Get device details

### Admin
- `POST /api/admin/create-user` - Create new user (Admin only)

### Health Check
- `GET /health` - Server health check

## Architecture Principles

- **Separation of Concerns**: Each layer has a single responsibility
- **No ORM**: Direct Supabase queries in services
- **Thin Controllers**: Controllers only handle req/res, delegate to services
- **Business Logic in Services**: All database and business logic in services
- **Consistent Responses**: Standardized API response format
- **Error Handling**: Centralized error handling middleware

## Security

- Firebase Admin SDK for authentication
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation (ready for implementation)
- Password hashing with bcrypt

## Logging

Logs are written to:
- Console (development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment | No | development |
| `SUPABASE_URL` | Supabase project URL | Yes | - |
| `SUPABASE_API_KEY` | Supabase API key | Yes | - |
| `JWT_SECRET` | JWT secret key | No | - |
| `CORS_ORIGIN` | CORS origin | No | * |

## License

ISC
