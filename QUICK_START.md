# Quick Start Guide

## 🚀 Running the Application

### Prerequisites
- Node.js 18+ installed
- MongoDB running (local or Atlas)

### Step 1: Backend Setup

```bash
cd backend

# Dependencies already installed
# Create/edit .env file if needed

# Start backend
npm run dev
```

Backend will run on **http://localhost:5000**

### Step 2: Frontend Setup

```bash
cd student-platform

# Dependencies already installed
# .env file already created

# Start frontend
npm run dev
```

Frontend will run on **http://localhost:5173**

## ✅ Verification

1. **Backend**: Visit http://localhost:5000/health
   - Should return: `{"status":"OK","timestamp":"..."}`

2. **Frontend**: Visit http://localhost:5173
   - Should show the login page

## 🎯 Test the Flow

1. **Register**: Go to http://localhost:5173/register
   - Create a new account
   
2. **Login**: Use your credentials
   
3. **Browse Exams**: You'll be redirected to exams page
   - Note: You need to create exams via API or admin panel first

## 📝 Creating Test Data

### Option 1: Using MongoDB Compass or Shell

```javascript
// Connect to: mongodb://localhost:27017/test-series-platform

// 1. First, seed roles (REQUIRED)
// Run in backend: npm run seed:roles

// 2. Create an exam
db.exams.insertOne({
  name: "SSC CGL 2024",
  code: "SSC-CGL-2024",
  description: "Staff Selection Commission Combined Graduate Level",
  category: "ssc",
  subjects: [
    {
      code: "GK",
      name: "General Knowledge",
      topics: ["History", "Geography", "Polity"]
    },
    {
      code: "MATH",
      name: "Mathematics",
      topics: ["Algebra", "Geometry", "Arithmetic"]
    }
  ],
  isActive: true,
  createdBy: null,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Option 2: Using API (Postman/Thunder Client)

```bash
# 1. Register a user
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

# 2. Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

# Copy the accessToken from response

# 3. Create an exam (requires admin role)
POST http://localhost:5000/api/exams
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "SSC CGL 2024",
  "code": "SSC-CGL-2024",
  "description": "Staff Selection Commission Combined Graduate Level",
  "category": "ssc",
  "subjects": [
    {
      "code": "GK",
      "name": "General Knowledge",
      "topics": ["History", "Geography"]
    }
  ]
}
```

## 🔧 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify .env file has correct MongoDB URI
- Run: `npm run seed:roles` first

### Frontend shows blank page
- Check browser console for errors
- Verify backend is running
- Check .env has correct API URL

### Can't create exams
- You need admin role
- Manually update user role in MongoDB:
  ```javascript
  // Find admin role ID
  db.roles.findOne({name: 'admin'})
  
  // Update user
  db.users.updateOne(
    {email: 'test@example.com'},
    {$set: {roleId: ADMIN_ROLE_ID}}
  )
  ```

## 📱 Features to Test

1. ✅ User Registration
2. ✅ User Login
3. ✅ Browse Exams (after creating some)
4. ✅ View Tests
5. ✅ Take Test (CBT interface)
6. ✅ Submit Test
7. ✅ View Results

## 🎓 Next Steps

1. Create sample exams and tests
2. Add questions to tests
3. Take a test and view results
4. Build admin panel for easier management

## 📞 Need Help?

- Check logs in backend terminal
- Check browser console for frontend errors
- Refer to DEPLOYMENT_GUIDE.md for production setup
