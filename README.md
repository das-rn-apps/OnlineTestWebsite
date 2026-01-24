# Test Series Platform - Project Root

Enterprise-level test series platform for competitive exams (SSC, JPSC, JEE, NEET, Banking, Railway, UPSC).

## 📁 Project Structure

```
test-series-platform/
├── backend/              # Node.js + Express + TypeScript + MongoDB
├── student-platform/     # React + Vite + TypeScript + Tailwind
├── admin-panel/          # React + Vite + TypeScript + Tailwind (setup ready)
└── docs/                 # Documentation
```

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI and secrets
npm run seed:roles
npm run dev
```

### Student Platform
```bash
cd student-platform
npm install
cp .env.example .env
npm run dev
```

## 📚 Documentation

- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Specification](docs/API_SPECIFICATION.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

## ✨ Features

- ✅ Complete authentication system
- ✅ Exam and test management
- ✅ Test-taking engine with auto-evaluation
- ✅ Results with comprehensive analytics
- ✅ Multi-language support (EN/HI)
- ✅ Role-based access control

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand

## 📊 Status

- **Backend**: ✅ Complete (40+ files)
- **Student Platform**: ✅ Core features working
- **Admin Panel**: ⏳ Setup ready
- **Documentation**: ✅ Complete

## 🎯 Supported Exams

SSC, JPSC, JEE Main, NEET, Banking, Railway, UPSC

## 📝 License

MIT
