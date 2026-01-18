# Child Milestone Tracker - Backend API

NestJS REST API for tracking child milestone events with photo/video support.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env if needed (defaults are fine for local development)
```

3. **Start the development server:**
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

### First-Time Setup

After starting the server, seed the default categories:

```bash
curl -X POST http://localhost:3000/api/categories/seed
```

This creates 7 default milestone categories (Physical, Cognitive, Social, Language, Creative, Health, Other).

## 📁 Project Structure

```
backend/
├── src/
│   ├── categories/          # Category management
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   └── categories.module.ts
│   ├── milestones/          # Milestone management
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── milestones.controller.ts
│   │   ├── milestones.service.ts
│   │   └── milestones.module.ts
│   ├── media/               # Media upload & management
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── media.controller.ts
│   │   ├── media.service.ts
│   │   └── media.module.ts
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
├── data/                    # SQLite database (auto-created)
├── uploads/                 # Uploaded media files (auto-created)
│   ├── images/
│   ├── videos/
│   └── thumbnails/
└── package.json
```

## 🔌 API Endpoints

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `POST /api/categories/seed` - Seed default categories

### Milestones

- `GET /api/milestones` - Get all milestones (with filters)
  - Query params: `categoryId`, `isMajor`, `startDate`, `endDate`
- `GET /api/milestones/:id` - Get milestone by ID
- `GET /api/milestones/timeline` - Get timeline view (grouped by year/month)
- `GET /api/milestones/stats` - Get milestone statistics
- `POST /api/milestones` - Create new milestone
- `PATCH /api/milestones/:id` - Update milestone
- `DELETE /api/milestones/:id` - Delete milestone

### Media

- `GET /api/media` - Get all media (with filters)
  - Query params: `milestoneId`, `fileType`, `startDate`, `endDate`
- `GET /api/media/gallery` - Get standalone media (not linked to milestones)
  - Query params: `fileType` (image/video)
- `GET /api/media/:id` - Get media by ID
- `POST /api/media/upload` - Upload media file
- `PATCH /api/media/:id` - Update media metadata
- `DELETE /api/media/:id` - Delete media

### Static Files

- `GET /uploads/**` - Access uploaded media files

## 📝 API Usage Examples

### Create a Milestone

```bash
curl -X POST http://localhost:3000/api/milestones \
  -H "Content-Type: application/json" \
  -d '{
    "title": "First Steps",
    "description": "Took first independent steps!",
    "eventDate": "2024-01-15T10:30:00Z",
    "categoryId": 1,
    "isMajor": true,
    "notes": "So proud!"
  }'
```

### Upload Media

```bash
curl -X POST http://localhost:3000/api/media/upload \
  -F "file=@/path/to/photo.jpg" \
  -F "caption=First steps photo" \
  -F "takenDate=2024-01-15T10:30:00Z" \
  -F "milestoneId=1"
```

### Upload Standalone Media (Gallery)

```bash
curl -X POST http://localhost:3000/api/media/upload \
  -F "file=@/path/to/photo.jpg" \
  -F "caption=Playing in the park" \
  -F "takenDate=2024-01-20T14:00:00Z"
```

### Get Timeline

```bash
curl http://localhost:3000/api/milestones/timeline
```

### Get Gallery (Standalone Media)

```bash
# All standalone media
curl http://localhost:3000/api/media/gallery

# Only images
curl http://localhost:3000/api/media/gallery?fileType=image

# Only videos
curl http://localhost:3000/api/media/gallery?fileType=video
```

## 🗄️ Database

- **Type:** SQLite
- **Location:** `./data/milestone.db`
- **Auto-sync:** Enabled in development (tables auto-created)

### Backup

Simply copy the database file and uploads directory:

```bash
# Backup database
cp data/milestone.db data/milestone.backup.db

# Backup uploads
cp -r uploads uploads.backup
```

## 🔧 Configuration

Edit `.env` file:

```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_TYPE=sqlite
DB_DATABASE=./data/milestone.db

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=200
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
ALLOWED_VIDEO_TYPES=video/mp4,video/webm,video/quicktime

# CORS
CORS_ORIGIN=http://localhost:4200
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Build for Production

```bash
# Build
npm run build

# Run production server
npm run start:prod
```

## 🛠️ Development Scripts

```bash
npm run start          # Start server
npm run start:dev      # Start with watch mode
npm run start:debug    # Start with debug mode
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint
```

## 📋 Features

✅ RESTful API with NestJS  
✅ SQLite database with TypeORM  
✅ File upload with validation  
✅ Automatic thumbnail generation for images  
✅ Timeline view grouped by year/month  
✅ Milestone statistics  
✅ Category-based organization  
✅ Standalone media gallery  
✅ CORS enabled for frontend  
✅ Input validation with class-validator  
✅ Error handling  

## 🔐 Security Notes

For production deployment:
- Add authentication (JWT, OAuth, etc.)
- Use environment-specific configurations
- Enable HTTPS
- Set up proper CORS origins
- Use migrations instead of auto-sync
- Add rate limiting
- Implement file upload size limits per user
- Add virus scanning for uploads

## 📚 Tech Stack

- **Framework:** NestJS 10
- **Database:** SQLite with TypeORM
- **Validation:** class-validator, class-transformer
- **File Upload:** Multer
- **Image Processing:** Sharp
- **Configuration:** @nestjs/config

