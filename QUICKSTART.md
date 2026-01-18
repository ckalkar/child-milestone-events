# ⚡ Quick Start Guide

Get the Child Milestone Tracker running in 5 minutes!

## Prerequisites

- Node.js 18+ installed ([Download here](https://nodejs.org/))

## Setup Steps

### 1️⃣ Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start the server
npm run start:dev
```

Wait for: `Application is running on: http://localhost:3000`

### 2️⃣ Seed Categories (30 seconds)

Open a **new terminal**:

```bash
# Seed default categories
curl -X POST http://localhost:3000/api/categories/seed
```

You should see: `"message": "Default categories seeded successfully"`

### 3️⃣ Frontend Setup (2 minutes)

Open a **new terminal**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the app
npm start
```

Wait for: `Compiled successfully`

### 4️⃣ Open the App

Open your browser to: **http://localhost:4200**

## 🎉 You're Done!

### Try These Actions:

1. **Create a Milestone:**
   - Click "Milestones" → "Add Milestone"
   - Fill in the form and upload a photo
   - Click "Create Milestone"

2. **View Timeline:**
   - Click "Timeline" to see your milestone

3. **Upload to Gallery:**
   - Click "Gallery" → "Upload Media"
   - Select photos/videos

## 📁 What Was Created?

- **Database:** `backend/data/milestone.db`
- **Uploads:** `backend/uploads/` (created on first upload)

## 🛑 Stop the App

Press `Ctrl+C` in both terminal windows

## 🔄 Restart Later

**Terminal 1 (Backend):**
```bash
cd backend
npm run start:dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

## 📚 Learn More

- [README.md](README.md) - Full documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Database design

## ❓ Troubleshooting

**Backend won't start?**
- Check if port 3000 is available
- Try: `npm install` again

**Frontend won't start?**
- Check if port 4200 is available
- Try: `npm install` again

**Can't connect?**
- Make sure backend is running first
- Check `http://localhost:3000/api` in browser

---

**Need help?** See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting.

