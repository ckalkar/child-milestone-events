# 🍼 Child Milestone Tracker

A full-stack web application for tracking and visualizing your child's milestone events and growth timeline with photo and video support.

![Tech Stack](https://img.shields.io/badge/Frontend-Angular-red)
![Tech Stack](https://img.shields.io/badge/Backend-NestJS-red)
![Tech Stack](https://img.shields.io/badge/Database-SQLite-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 📅 Timeline View
- **Chronological Display:** Beautiful vertical timeline organized by year and month
- **Visual Markers:** Color-coded milestone markers with category icons
- **Major Milestone Highlights:** Special styling for important life events
- **Media Previews:** Thumbnail images displayed inline with milestones
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices

### 📝 Milestone Management
- **Full CRUD Operations:** Create, read, update, and delete milestones
- **Rich Data Capture:**
  - Title and description
  - Event date and time
  - Category assignment (Physical, Cognitive, Social, Language, Creative, Health, Other)
  - Major milestone flag
  - Additional notes
- **Media Attachments:** Upload multiple photos and videos per milestone
- **Advanced Filtering:** Filter by category, date range, and major milestones
- **Detailed View:** Full milestone information with all attached media

### 🖼️ Photo & Video Gallery
- **Standalone Media:** Upload photos/videos not tied to specific milestones
- **Organized Display:** Grid layout with responsive design
- **Media Types:** Support for images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, QuickTime)
- **Quick Actions:** View full size, download, or delete media
- **Automatic Thumbnails:** Generated thumbnails for fast loading

### 🎨 Additional Features
- **Category System:** Pre-defined categories with custom colors and icons
- **Statistics Dashboard:** View milestone counts and breakdowns
- **File Management:** Organized file storage with automatic thumbnail generation
- **Data Validation:** Input validation on both frontend and backend
- **Error Handling:** Comprehensive error handling and user feedback

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- **Framework:** Angular 17
- **UI Library:** Angular Material
- **State Management:** RxJS
- **HTTP Client:** Angular HttpClient
- **Date Utilities:** date-fns

**Backend:**
- **Framework:** NestJS 10
- **ORM:** TypeORM
- **Database:** SQLite
- **File Upload:** Multer
- **Image Processing:** Sharp
- **Validation:** class-validator

**Database:**
- **Type:** SQLite (file-based)
- **Schema:** 4 main tables (categories, milestones, media, child_profile)
- **Relationships:** One-to-many between categories/milestones and milestones/media

### Project Structure

```
child-milestone-events/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── categories/      # Category module
│   │   ├── milestones/      # Milestone module
│   │   ├── media/           # Media module
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── data/                # SQLite database (auto-created)
│   ├── uploads/             # Uploaded media files (auto-created)
│   └── package.json
├── frontend/                # Angular app
│   ├── src/
│   │   ├── app/
│   │   │   ├── models/      # TypeScript interfaces
│   │   │   ├── services/    # API services
│   │   │   ├── pages/       # Feature modules
│   │   │   └── shared/      # Shared components
│   │   ├── environments/
│   │   └── styles.scss
│   └── package.json
├── DATABASE_SCHEMA.md       # Database design documentation
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js:** 18.x or higher
- **npm:** 9.x or higher
- **Git:** For version control

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd child-milestone-events
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the backend server
npm run start:dev
```

The backend API will be running at `http://localhost:3000/api`

#### 3. Seed Default Categories (First Time Only)

```bash
curl -X POST http://localhost:3000/api/categories/seed
```

This creates 7 default milestone categories.

#### 4. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be running at `http://localhost:4200`

### 🎉 You're Ready!

Open your browser and navigate to `http://localhost:4200` to start using the application!

## 📖 Usage Guide

### Adding Your First Milestone

1. Click **"Milestones"** in the navigation bar
2. Click **"Add Milestone"** button
3. Fill in the milestone details:
   - Title (e.g., "First Steps")
   - Event Date
   - Category (e.g., "Physical")
   - Description and notes
   - Check "Major Milestone" if applicable
4. Optionally attach photos/videos
5. Click **"Create Milestone"**

### Viewing the Timeline

1. Click **"Timeline"** in the navigation bar
2. Browse milestones organized by year and month
3. Click on any milestone to view full details
4. Major milestones are highlighted with a star icon

### Managing Media

**Attach to Milestone:**
- Create/edit a milestone and upload files
- Or view a milestone and click "Add Media"

**Standalone Gallery:**
1. Click **"Gallery"** in the navigation bar
2. Click **"Upload Media"** to add photos/videos
3. Use tabs to filter by media type
4. Click any item to view full size

## 🗄️ Database Schema

### Tables

**categories**
- Stores milestone categories (Physical, Cognitive, Social, etc.)
- Fields: id, name, description, color, icon

**milestones**
- Stores milestone events
- Fields: id, title, description, eventDate, categoryId, notes, isMajor

**media**
- Stores photos and videos
- Fields: id, filename, filePath, fileType, mimeType, fileSize, milestoneId

**child_profile** (optional)
- Stores child information
- Fields: id, name, birthDate, gender, profilePhoto

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for detailed schema design.

## 🔌 API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `GET /api/categories/:id` - Get category by ID
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `POST /api/categories/seed` - Seed default categories

### Milestones
- `GET /api/milestones` - Get all milestones (with filters)
- `POST /api/milestones` - Create milestone
- `GET /api/milestones/:id` - Get milestone by ID
- `PATCH /api/milestones/:id` - Update milestone
- `DELETE /api/milestones/:id` - Delete milestone
- `GET /api/milestones/timeline` - Get timeline view
- `GET /api/milestones/stats` - Get statistics

### Media
- `GET /api/media` - Get all media (with filters)
- `POST /api/media/upload` - Upload media file
- `GET /api/media/:id` - Get media by ID
- `PATCH /api/media/:id` - Update media metadata
- `DELETE /api/media/:id` - Delete media
- `GET /api/media/gallery` - Get standalone media

## 🎨 Customization

### Adding Custom Categories

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Category",
    "description": "My custom category",
    "color": "#FF5733",
    "icon": "star"
  }'
```

### Changing Theme Colors

Edit `frontend/src/styles.scss` and customize the Material theme.

## 📦 Backup & Restore

### Backup

```bash
# Backup database
cp backend/data/milestone.db backup/milestone-$(date +%Y%m%d).db

# Backup uploads
cp -r backend/uploads backup/uploads-$(date +%Y%m%d)
```

### Restore

```bash
# Restore database
cp backup/milestone-20240115.db backend/data/milestone.db

# Restore uploads
cp -r backup/uploads-20240115 backend/uploads
```

## 🚀 Production Deployment

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### Docker (Optional)

Create `docker-compose.yml` for containerized deployment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- NestJS Team for the powerful backend framework
- Material Design for the beautiful UI components

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for tracking precious childhood moments**

