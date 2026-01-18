# 🚀 Complete Setup Guide - Child Milestone Tracker

This guide will walk you through setting up the Child Milestone Tracker application from scratch.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [First Run](#first-run)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

---

## Prerequisites

### Required Software

Before you begin, ensure you have the following installed:

#### 1. Node.js and npm

**Version Required:** Node.js 18.x or higher

**Check if installed:**
```bash
node --version
npm --version
```

**Installation:**
- **Windows/Mac:** Download from [nodejs.org](https://nodejs.org/)
- **Linux (Ubuntu/Debian):**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

#### 2. Git (Optional but recommended)

**Check if installed:**
```bash
git --version
```

**Installation:**
- **Windows:** Download from [git-scm.com](https://git-scm.com/)
- **Mac:** `brew install git` or download from git-scm.com
- **Linux:** `sudo apt-get install git`

---

## Initial Setup

### Step 1: Get the Code

**Option A: Clone from Git (if using version control)**
```bash
git clone <repository-url>
cd child-milestone-events
```

**Option B: Extract from ZIP**
```bash
# Extract the ZIP file to a folder
cd child-milestone-events
```

### Step 2: Verify Project Structure

Your project should have this structure:
```
child-milestone-events/
├── backend/
├── frontend/
├── README.md
├── DATABASE_SCHEMA.md
└── SETUP_GUIDE.md (this file)
```

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- NestJS framework
- TypeORM and SQLite
- File upload libraries (Multer, Sharp)
- Validation libraries

**Expected output:** You should see a progress bar and "added XXX packages" message.

### Step 3: Configure Environment Variables

Create a `.env` file from the example:

**Windows:**
```bash
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

**Edit `.env` file** (optional - defaults work fine):
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_PATH=./data/milestone.db

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### Step 4: Start the Backend Server

```bash
npm run start:dev
```

**Expected output:**
```
[Nest] 12345  - 01/15/2024, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 01/15/2024, 10:30:00 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 01/15/2024, 10:30:00 AM     LOG [RoutesResolver] CategoriesController {/api/categories}
[Nest] 12345  - 01/15/2024, 10:30:00 AM     LOG [RoutesResolver] MilestonesController {/api/milestones}
[Nest] 12345  - 01/15/2024, 10:30:00 AM     LOG [RoutesResolver] MediaController {/api/media}
[Nest] 12345  - 01/15/2024, 10:30:00 AM     LOG [NestApplication] Nest application successfully started
[Nest] 12345  - 01/15/2024, 10:30:00 AM     LOG Application is running on: http://localhost:3000
```

✅ **Backend is now running!**

### Step 5: Seed Default Categories

Open a **new terminal** (keep the backend running) and run:

**Windows:**
```bash
curl -X POST http://localhost:3000/api/categories/seed
```

**Mac/Linux:**
```bash
curl -X POST http://localhost:3000/api/categories/seed
```

**Alternative (if curl not available):**
- Open your browser
- Install a REST client extension (e.g., "REST Client" for VS Code)
- Or use Postman to send a POST request to `http://localhost:3000/api/categories/seed`

**Expected output:**
```json
{
  "message": "Default categories seeded successfully",
  "count": 7
}
```

This creates 7 default categories:
1. Physical Development
2. Cognitive Development
3. Social & Emotional
4. Language & Communication
5. Creative & Artistic
6. Health & Medical
7. Other

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **new terminal** (keep backend running) and run:

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Angular framework
- Angular Material UI components
- RxJS for reactive programming
- Date utilities

**Expected output:** "added XXX packages" message.

### Step 3: Verify Environment Configuration

Check `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  uploadsUrl: 'http://localhost:3000/uploads',
};
```

These should match your backend configuration.

### Step 4: Start the Frontend Server

```bash
npm start
```

**Expected output:**
```
✔ Browser application bundle generation complete.
Initial Chunk Files   | Names         |  Raw Size
main.js               | main          |   XXX kB
polyfills.js          | polyfills     |   XXX kB
styles.css            | styles        |   XXX kB

** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

✅ **Frontend is now running!**

---

## First Run

### Step 1: Open the Application

Open your web browser and navigate to:
```
http://localhost:4200
```

You should see the Child Milestone Tracker application!

### Step 2: Explore the Interface

The application has three main sections:

1. **Timeline** - View milestones in chronological order
2. **Milestones** - Manage milestone events
3. **Gallery** - Browse photos and videos

### Step 3: Create Your First Milestone

1. Click **"Milestones"** in the navigation bar
2. Click the **"Add Milestone"** button
3. Fill in the form:
   - **Title:** "First Steps"
   - **Event Date:** Select a date
   - **Category:** Choose "Physical Development"
   - **Description:** "Took first independent steps!"
   - **Check:** "Mark as Major Milestone"
4. Optionally, click **"Choose Files"** to attach photos
5. Click **"Create Milestone"**

### Step 4: View the Timeline

1. Click **"Timeline"** in the navigation
2. You should see your milestone displayed!
3. Major milestones have a star icon

### Step 5: Upload to Gallery

1. Click **"Gallery"** in the navigation
2. Click **"Upload Media"**
3. Select photos or videos
4. View them in the gallery grid

---

## Troubleshooting

### Backend Issues

#### Issue: Port 3000 already in use
**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
1. Find and stop the process using port 3000
   - **Windows:** `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
   - **Mac/Linux:** `lsof -ti:3000 | xargs kill -9`
2. Or change the port in `.env`: `PORT=3001`

#### Issue: Database file not created
**Error:** Database-related errors

**Solution:**
1. Ensure the `data/` directory exists: `mkdir data`
2. Check file permissions
3. Restart the backend server

#### Issue: npm install fails
**Error:** Various npm errors

**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm cache clean --force`
3. Run `npm install` again

### Frontend Issues

#### Issue: Cannot connect to backend
**Error:** HTTP errors in browser console

**Solution:**
1. Verify backend is running on port 3000
2. Check `environment.ts` has correct `apiUrl`
3. Check browser console for CORS errors

#### Issue: Port 4200 already in use
**Error:** Port conflict

**Solution:**
1. Stop other Angular apps
2. Or run with different port: `ng serve --port 4201`

#### Issue: Module not found errors
**Error:** TypeScript compilation errors

**Solution:**
1. Delete `node_modules` and `.angular/cache`
2. Run `npm install` again
3. Restart the dev server

### General Issues

#### Issue: Images not displaying
**Solution:**
1. Check that `uploads/` directory exists in backend
2. Verify `uploadsUrl` in `environment.ts`
3. Check browser console for 404 errors

#### Issue: File upload fails
**Solution:**
1. Check file size (max 10MB by default)
2. Verify file type is supported (images: jpg, png, gif, webp; videos: mp4, webm, mov)
3. Check backend logs for errors

---

## Next Steps

### Recommended Actions

1. **Customize Categories**
   - Add your own categories via the API or database
   - Customize colors and icons

2. **Backup Your Data**
   ```bash
   # Backup database
   cp backend/data/milestone.db backup/

   # Backup uploads
   cp -r backend/uploads backup/
   ```

3. **Explore Advanced Features**
   - Filter milestones by category
   - Use the timeline view for visualization
   - Add multiple photos to milestones

4. **Learn the API**
   - Check `README.md` for API endpoints
   - Use Postman or curl to test endpoints
   - Review `DATABASE_SCHEMA.md` for data structure

### Development Tips

1. **Hot Reload**
   - Both frontend and backend support hot reload
   - Changes are automatically reflected

2. **Debugging**
   - Backend: Check terminal logs
   - Frontend: Use browser DevTools (F12)

3. **Database Inspection**
   - Use SQLite browser tools to view data
   - Download: [DB Browser for SQLite](https://sqlitebrowser.org/)

### Production Deployment

When ready to deploy:

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Build Backend:**
   ```bash
   cd backend
   npm run build
   npm run start:prod
   ```

3. **Deploy:**
   - See `README.md` for deployment options
   - Consider Docker for containerization
   - Use nginx for reverse proxy

---

## 🎉 Congratulations!

You've successfully set up the Child Milestone Tracker application!

### Quick Reference

**Start Backend:**
```bash
cd backend
npm run start:dev
```

**Start Frontend:**
```bash
cd frontend
npm start
```

**Access Application:**
```
http://localhost:4200
```

**API Documentation:**
```
http://localhost:3000/api
```

---

## 📚 Additional Resources

- [README.md](README.md) - Project overview and features
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Database design
- [backend/README.md](backend/README.md) - Backend documentation
- [frontend/README.md](frontend/README.md) - Frontend documentation

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. Check the troubleshooting section above
2. Review the README files
3. Check backend/frontend logs for errors
4. Open an issue on GitHub (if applicable)

---

**Happy milestone tracking! 🍼👶📸**

