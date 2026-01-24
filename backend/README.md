# Test Series Platform - Backend

Enterprise-level test series platform backend built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- ✅ **Authentication & Authorization**: JWT-based auth with RBAC
- ✅ **Exam Management**: Create and manage exams with subject hierarchy
- ✅ **Test Engine**: Full-featured test creation and management
- ✅ **Test Taking**: Complete test attempt flow with timer and auto-submit
- ✅ **Evaluation**: Automatic test evaluation with detailed analytics
- ✅ **Results & Analytics**: Comprehensive performance analysis
- ✅ **Multi-language Support**: English and Hindi
- ✅ **Security**: Multiple layers of security implementation

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## 🔧 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# Required: MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
```

## 🌱 Database Setup

```bash
# Seed roles (required before first use)
npm run seed:roles

# Optional: Seed sample exams
npm run seed:exams

# Optional: Create admin user
npm run create:admin
```

## 🏃 Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams` - Create exam (Admin)
- `PUT /api/exams/:id` - Update exam (Admin)
- `DELETE /api/exams/:id` - Delete exam (Super Admin)

### Tests
- `GET /api/tests` - Get all tests
- `GET /api/tests/:id` - Get test details
- `GET /api/tests/:id/full` - Get complete test with questions (Private)
- `POST /api/tests` - Create test (Admin)
- `PUT /api/tests/:id` - Update test (Admin)
- `PUT /api/tests/:id/publish` - Publish/unpublish test (Admin)
- `DELETE /api/tests/:id` - Delete test (Admin)

### Test Attempts
- `POST /api/attempts/start` - Start test attempt
- `GET /api/attempts/:id` - Get attempt details
- `POST /api/attempts/:id/answer` - Submit answer
- `POST /api/attempts/:id/submit` - Submit test
- `GET /api/attempts/my-attempts` - Get user's attempts

### Results
- `GET /api/results/my-results` - Get user's results
- `GET /api/results/:attemptId` - Get result by attempt ID
- `GET /api/results/:attemptId/detailed` - Get detailed result
- `GET /api/results/:attemptId/comparison` - Compare with topper/average

## 🗄️ Database Models

- **User** - User authentication and profiles
- **Role** - RBAC roles and permissions
- **Exam** - Exam categories with subjects
- **Test** - Test papers with configuration
- **Section** - Test sections
- **Question** - Question bank
- **Attempt** - Test attempts
- **Answer** - User answers
- **Result** - Results with analytics
- **Subscription** - User subscriptions
- **Coupon** - Discount coupons
- **ActivityLog** - Audit trail

## 🔐 Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/test-series-platform

# JWT
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Optional
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── controllers/     # Route controllers
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── scripts/         # Database scripts
│   ├── app.ts           # Express app
│   └── server.ts        # Server entry point
├── uploads/             # Uploaded files
├── logs/                # Application logs
└── tests/               # Test files
```

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Permission-based authorization
- MongoDB injection prevention
- Rate limiting
- Security headers (Helmet)
- CORS configuration
- Input validation

## 🎯 Roles & Permissions

### Student
- Take tests
- View own results
- Manage profile

### Examiner
- Create/edit questions
- View tests

### Admin
- All examiner permissions
- Manage exams and tests
- View all users
- Manage subscriptions and coupons

### Super Admin
- All admin permissions
- Delete users and exams
- System configuration

## 📝 License

MIT

## 👥 Support

For support, email support@testseries.com
