# Database Schema Design

## Database Choice: SQLite

**Rationale:**
- Zero configuration required
- File-based storage (easy backup)
- Perfect for single-user local applications
- Excellent performance for this use case
- No separate server process needed

## Schema Design

### Tables

#### 1. **categories**
Stores milestone categories (e.g., Physical, Cognitive, Social, Language)

```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7), -- Hex color for UI display
  icon VARCHAR(50), -- Icon name/class
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **milestones**
Stores milestone events

```sql
CREATE TABLE milestones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATETIME NOT NULL,
  category_id INTEGER,
  notes TEXT,
  is_major BOOLEAN DEFAULT 0, -- Flag for major milestones to highlight
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

#### 3. **media**
Stores photos and videos (both milestone-linked and standalone)

```sql
CREATE TABLE media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- 'image' or 'video'
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER, -- in bytes
  width INTEGER, -- for images/videos
  height INTEGER, -- for images/videos
  duration INTEGER, -- for videos (in seconds)
  caption TEXT,
  taken_date DATETIME, -- When photo/video was taken
  milestone_id INTEGER NULL, -- NULL if standalone media
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE CASCADE
);
```

#### 4. **child_profile** (Optional - for future enhancement)
Stores child information

```sql
CREATE TABLE child_profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(20),
  profile_photo_path VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes for Performance

```sql
-- Index on milestone event_date for timeline queries
CREATE INDEX idx_milestones_event_date ON milestones(event_date DESC);

-- Index on media taken_date for gallery queries
CREATE INDEX idx_media_taken_date ON media(taken_date DESC);

-- Index on media milestone_id for quick lookups
CREATE INDEX idx_media_milestone_id ON media(milestone_id);

-- Index on milestones category_id
CREATE INDEX idx_milestones_category_id ON milestones(category_id);
```

## Sample Data (Seed Data)

### Default Categories:
1. **Physical** - Walking, running, motor skills (Color: #FF6B6B)
2. **Cognitive** - Learning, problem-solving (Color: #4ECDC4)
3. **Social** - Interactions, emotions (Color: #FFE66D)
4. **Language** - Speaking, communication (Color: #95E1D3)
5. **Creative** - Art, music, imagination (Color: #C7CEEA)
6. **Health** - Medical checkups, vaccinations (Color: #FFA07A)
7. **Other** - Miscellaneous milestones (Color: #B0B0B0)

## Relationships

```
categories (1) ----< (many) milestones
milestones (1) ----< (many) media
media (standalone) - milestone_id is NULL
```

## File Storage Strategy

### Directory Structure:
```
uploads/
├── images/
│   ├── 2024/
│   │   ├── 01/
│   │   ├── 02/
│   │   └── ...
│   └── thumbnails/
│       └── 2024/
│           ├── 01/
│           └── ...
└── videos/
    └── 2024/
        ├── 01/
        └── ...
```

### File Naming Convention:
- Format: `{timestamp}_{uuid}.{extension}`
- Example: `1704067200000_a1b2c3d4-e5f6-7890.jpg`
- Prevents naming conflicts
- Maintains chronological order

### Thumbnail Generation:
- Auto-generate thumbnails for images (e.g., 300x300px)
- Video thumbnails from first frame
- Store in separate thumbnails directory

## Data Validation Rules

### Milestones:
- `title`: Required, max 255 characters
- `event_date`: Required, cannot be in the future
- `category_id`: Optional, must exist in categories table
- `is_major`: Boolean, defaults to false

### Media:
- `filename`: Required, unique
- `file_type`: Must be 'image' or 'video'
- `mime_type`: Allowed types:
  - Images: image/jpeg, image/png, image/gif, image/webp
  - Videos: video/mp4, video/webm, video/quicktime
- `file_size`: Max 50MB for images, 200MB for videos
- `taken_date`: Optional, cannot be in the future

### Categories:
- `name`: Required, unique, max 100 characters
- `color`: Valid hex color format (#RRGGBB)

## Backup Strategy

Since SQLite is file-based:
1. Regular automated backups of the `.db` file
2. Backup the entire `uploads/` directory
3. Consider cloud sync (Dropbox, Google Drive) for automatic backup
4. Export functionality to JSON for data portability

