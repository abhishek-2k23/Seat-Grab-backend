# 🎫 Book My Ticket

A modern, scalable ticket booking system backend built with Node.js, Express, and PostgreSQL. This application provides a robust API for user authentication and seat booking management.

---

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Project Architecture](#-project-architecture)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)

---

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 🎫 **Seat Booking System** - Book and manage seat reservations
- 🔒 **Password Encryption** - Industry-standard bcrypt encryption for passwords
- 🚀 **Refresh Tokens** - Secure token refresh mechanism for extended sessions
- 📦 **Docker Support** - Containerized deployment ready
- ✅ **Input Validation** - Joi schema validation for all inputs
- 🌐 **CORS Enabled** - Cross-Origin Resource Sharing support
- 🔄 **Auto Migrations** - Automatic database schema initialization

---

## 📁 Project Structure

```
book-my-ticket/
├── auth/                          # Authentication module
│   ├── auth.controller.mjs        # Auth request handlers
│   ├── auth.middleware.mjs        # JWT verification middleware
│   ├── auth.query.mjs             # Database queries for auth
│   ├── auth.routes.mjs            # Auth API routes
│   ├── auth.service.mjs           # Business logic
│   └── dto/
│       ├── login.dto.mjs          # Login request schema
│       └── register.dto.mjs       # Registration request schema
│
├── booking/                       # Booking module
│   ├── booking.controller.mjs     # Booking request handlers
│   ├── booking.dto.mjs            # Booking validation schema
│   ├── booking.model.sql          # Booking SQL models
│   ├── booking.query.mjs          # Database queries
│   └── booking.service.mjs        # Business logic
│
├── common/                        # Shared utilities
│   ├── dto/
│   │   └── base.dto.mjs           # Base validation schemas
│   ├── middleware/
│   │   └── validate.middleware.mjs # Request validation middleware
│   └── utils/
│       ├── api-error.mjs          # Error handling
│       ├── api-response.mjs       # Standard response format
│       └── jwt.utils.mjs          # JWT utilities
│
├── config/
│   └── db.mjs                     # Database configuration
│
├── migration/
│   └── init.sql                   # Database schema & seeds
│
├── index.mjs                      # Application entry point
├── index.html                     # Static HTML file
├── package.json                   # Dependencies & scripts
├── docker-compose.yml             # Docker configuration
└── db/                            # PostgreSQL data directory
```

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js (ES Modules) |
| **Framework** | Express.js 5.x |
| **Database** | PostgreSQL 12+ |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Hashing** | bcrypt, bcryptjs |
| **Validation** | Joi |
| **Development** | Nodemon |
| **CORS** | cors middleware |
| **Container** | Docker & Docker Compose |

---

## 📦 Installation

### Prerequisites

- **Node.js** v16+ and npm
- **PostgreSQL** 12+
- **Docker & Docker Compose** (optional, for containerized setup)

### Step 1: Clone or Navigate to Project

```bash
cd e:\Cohort26\backend\book-my-ticket
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment File

Create a `.env` file in the root directory:

```env
PORT=8080
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=book_my_ticket
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
NODE_ENV=development
```

---

## 🗄️ Database Setup

### Option 1: Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL container
- Expose database on `localhost:5432`
- Load environment variables from `.env`

### Option 2: Manual PostgreSQL Setup

1. **Create Database**
   ```sql
   CREATE DATABASE book_my_ticket;
   ```

2. **Connect to Database**
   ```bash
   psql -U postgres -d book_my_ticket
   ```

3. **Migration runs automatically** when you start the app (see `init.sql`)

### Database Schema

**Users Table:**
```sql
users (
  id: SERIAL PRIMARY KEY,
  name: TEXT,
  email: UNIQUE TEXT,
  password: HASHED TEXT,
  refresh_token: TEXT,
  created_at: TIMESTAMP
)
```

**Seats Table:**
```sql
seats (
  id: SERIAL PRIMARY KEY,
  seat_number: TEXT (A1-J10),
  isbooked: INT (0=available, 1=booked),
  name: TEXT,
  user_id: INT FOREIGN KEY
)
```

---

## 🚀 Running the Application

### Development Mode (with Auto-Reload)

```bash
npm run dev
```

The server will start on `http://localhost:8080`

### Production Mode

```bash
node index.mjs
```

### Verify Server is Running

```bash
curl http://localhost:8080
```

You should see the `index.html` response.

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login an existing user |
| `POST` | `/api/auth/refresh` | Refresh JWT token |

### Booking Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/booking/seats` | Get all available seats |
| `POST` | `/api/booking/book` | Book a seat (requires auth) |
| `GET` | `/api/booking/my-bookings` | Get user's bookings (requires auth) |
| `DELETE` | `/api/booking/cancel/:seatId` | Cancel a booking (requires auth) |

---

## 🔐 Authentication

### How JWT Works in This App

1. **Registration**: User registers → Password hashed → User stored in DB
2. **Login**: User credentials verified → JWT tokens generated
3. **Protected Routes**: Include `Authorization: Bearer <JWT_TOKEN>` header
4. **Token Refresh**: Use refresh token to get new access token

### Example: Authenticated Request

```bash
curl -X GET http://localhost:8080/api/booking/my-bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🏗️ Project Architecture

### MVC Pattern

Each module follows the **Model-View-Controller** pattern:

```
Request
  ↓
Routes (auth.routes.mjs)
  ↓
Controller (auth.controller.mjs)
  ↓
Service (auth.service.mjs)
  ↓
Query/Database (auth.query.mjs)
  ↓
Database (PostgreSQL)
  ↓
Response (api-response.mjs)
```

### Request Validation Flow

```
Incoming Request
  ↓
Validation Middleware (validate.middleware.mjs)
  ↓
Joi Schema Validation (DTOs)
  ↓
Controller Processing
  ↓
API Response Format
```

### Middleware Stack

- **Express JSON Parser**: `express.json()`
- **CORS**: `cors()`
- **Authentication**: `authenticate` middleware (JWT verification)
- **Validation**: `validate` middleware (Joi schemas)

---

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `secure_pass` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `book_my_ticket` |
| `JWT_SECRET` | JWT signing secret | `super_secret_key` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `refresh_secret` |
| `NODE_ENV` | Environment mode | `development` |

---

## 📝 Request/Response Examples

### Register User

**Request:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login User

**Request:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Book a Seat

**Request:**
```json
POST /api/booking/book
Authorization: Bearer <accessToken>
{
  "seatNumber": "A5"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Seat booked successfully",
  "data": {
    "seatId": 1,
    "seatNumber": "A5",
    "userId": 1,
    "bookedAt": "2024-04-15T10:30:00Z"
  }
}
```

---

## 🐛 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
- Ensure PostgreSQL is running
- Check `DB_HOST`, `DB_PORT`, and `DB_USER` in `.env`
- Verify database exists

### JWT Token Errors

```
Error: Invalid token
```

**Solution:**
- Ensure `JWT_SECRET` matches between server and token generation
- Check token hasn't expired
- Include correct `Authorization` header format

### Port Already in Use

```
Error: listen EADDRINUSE :::8080
```

**Solution:**
- Change `PORT` in `.env`
- Or kill process using port: `lsof -i :8080 | kill -9 <PID>`

---

## 📚 Key Files Explained

| File | Purpose |
|------|---------|
| `index.mjs` | App entry point, server initialization, migrations |
| `config/db.mjs` | Database connection and query execution |
| `auth/auth.service.mjs` | Authentication business logic |
| `auth/auth.middleware.mjs` | JWT token verification |
| `booking/booking.service.mjs` | Booking business logic |
| `common/utils/api-response.mjs` | Standardized API response format |
| `migration/init.sql` | Database schema and initial data |

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

### Code Style

- Use ES6+ syntax (JavaScript modules)
- Follow async/await pattern
- Use meaningful variable names
- Add comments for complex logic

---

## 📄 License

ISC License - See package.json for details

---

## 📞 Support

For issues or questions, please check the troubleshooting section or create an issue in the repository.

---

**Happy Booking! 🎉**

*Last Updated: April 2026*
