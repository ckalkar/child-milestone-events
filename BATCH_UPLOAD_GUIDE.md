# Batch Upload Utility

A comprehensive batch upload utility for uploading multiple images and their associated milestone data in bulk.

## Features

- **Bulk Image Upload**: Upload multiple images at once
- **Batch Milestone Creation**: Create multiple milestones in a single request
- **Validation**: Pre-upload validation of batch structure and files
- **Error Handling**: Detailed error reporting for failed uploads
- **Category Assignment**: Associate milestones with categories
- **Media Metadata**: Add captions and taken dates to images
- **Progress Tracking**: Real-time status updates during upload
- **Error Download**: Download error reports as text files

## Backend API Endpoints

### 1. Get Batch Template
**Endpoint**: `GET /api/batch/template`

Returns a sample batch structure to help you format your data correctly.

**Response**:
```json
{
  "message": "Use this structure to prepare your batch upload",
  "template": {
    "milestones": [
      {
        "title": "Sample Milestone",
        "description": "Sample description",
        "eventDate": "2026-01-02",
        "categoryId": 1,
        "notes": "Sample notes",
        "isMajor": false,
        "mediaFiles": [
          {
            "filename": "image1.jpg",
            "caption": "First photo",
            "takenDate": "2026-01-02"
          }
        ]
      }
    ]
  }
}
```

### 2. Validate Batch
**Endpoint**: `POST /api/batch/validate`

Validates the batch structure and files before uploading.

**Request**:
- `files`: Multiple files (multipart/form-data)
- `batchData`: JSON string containing batch configuration

**Response**:
```json
{
  "valid": true,
  "errors": [],
  "fileCount": 5,
  "milestoneCount": 2
}
```

### 3. Upload Batch
**Endpoint**: `POST /api/batch/upload`

Uploads all images and creates associated milestones.

**Request**:
- `files`: Multiple image/video files (multipart/form-data)
- `batchData`: JSON string containing batch configuration

**Response**:
```json
{
  "success": true,
  "summary": {
    "totalMilestones": 2,
    "processedMilestones": 2,
    "processedMedia": 5,
    "failureCount": 0
  },
  "data": {
    "milestones": [
      {
        "id": 1,
        "title": "First Birthday",
        "eventDate": "2026-01-02",
        "description": "...",
        "category": {...},
        "media": [...]
      }
    ]
  },
  "failures": []
}
```

## Frontend Usage

### Access the Batch Upload Interface

Navigate to: `/batch-upload`

### Step-by-Step Guide

1. **Select Files**
   - Click the file selector area or drag and drop
   - Multiple image/video files can be selected
   - Files are automatically populated in the media fields

2. **Fill Milestone Details**
   - Enter milestone title (required)
   - Select event date (required)
   - Choose category (optional)
   - Add description and notes (optional)
   - Mark as major milestone if applicable

3. **Configure Media Files**
   - Each uploaded file appears in the media section
   - Add captions and taken dates (optional)
   - Remove unwanted media files

4. **Validate Batch**
   - Click "Validate" to check structure before upload
   - Fix any errors reported
   - Review file count and milestone count

5. **Upload**
   - Click "Upload Batch"
   - Monitor progress in real-time
   - Review results and any failures

6. **Review Results**
   - View successfully processed milestones
   - Download error report if needed
   - Reset to upload another batch

## Batch Data Structure

### JSON Format

```json
{
  "milestones": [
    {
      "title": "First Birthday",
      "description": "Celebrating the first year",
      "eventDate": "2026-01-15",
      "categoryId": 1,
      "notes": "Party at home",
      "isMajor": true,
      "mediaFiles": [
        {
          "filename": "birthday_photo_1.jpg",
          "caption": "Blowing out candles",
          "takenDate": "2026-01-15"
        },
        {
          "filename": "birthday_photo_2.jpg",
          "caption": "With family",
          "takenDate": "2026-01-15"
        }
      ]
    },
    {
      "title": "First Steps",
      "description": "Baby took first steps",
      "eventDate": "2026-02-20",
      "categoryId": 2,
      "notes": "Walked 3 steps",
      "isMajor": true,
      "mediaFiles": [
        {
          "filename": "first_steps.mp4",
          "caption": "First successful steps",
          "takenDate": "2026-02-20"
        }
      ]
    }
  ]
}
```

## Batch Data Rules

### Milestones
- `title` (required): String, max 255 characters
- `eventDate` (required): ISO 8601 date format (YYYY-MM-DD)
- `description` (optional): String
- `categoryId` (optional): Valid category ID
- `notes` (optional): String
- `isMajor` (optional): Boolean, default false
- `mediaFiles` (required): Array of media file objects

### Media Files
- `filename` (required): Must match an uploaded file name
- `caption` (optional): String
- `takenDate` (optional): ISO 8601 date format

## Error Handling

### Common Errors

1. **File Not Found**
   ```
   Media file not found: image.jpg
   ```
   - Ensure the filename matches an uploaded file exactly
   - Check for typos and correct file extensions

2. **Invalid Date**
   ```
   Milestone 0: Invalid event date format
   ```
   - Use ISO 8601 format: YYYY-MM-DD
   - Example: 2026-01-15

3. **Missing Required Fields**
   ```
   Milestone 0: Title is required
   ```
   - Ensure all required fields are provided
   - Required fields: title, eventDate, mediaFiles

4. **No Files Uploaded**
   ```
   No files uploaded
   ```
   - Select at least one image/video file
   - Ensure file upload was successful

### Error Report Download

If any uploads fail:
1. Click "Download Error Report"
2. A text file with all errors is downloaded
3. Review and fix issues
4. Reupload if needed

## Supported File Types

### Images
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Videos
- MP4 (.mp4)
- WebM (.webm)
- QuickTime (.mov)

## Limitations

- **Max File Size**: 200 MB per file (configurable)
- **Max Files Per Batch**: 100 files
- **File Count**: Limited by server configuration

## Configuration

### Environment Variables (.env)

```env
# Upload directory
UPLOAD_DIR=./uploads

# Allowed file types
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
ALLOWED_VIDEO_TYPES=video/mp4,video/webm,video/quicktime

# Max file size in MB
MAX_FILE_SIZE_MB=200

# Node environment
NODE_ENV=development
```

## Backend File Structure

```
src/batch/
├── batch.controller.ts      # API endpoints
├── batch.service.ts         # Business logic
├── batch.module.ts          # Module definition
└── dto/
    └── batch-item.dto.ts    # Data transfer objects
```

## Frontend File Structure

```
src/app/
├── pages/batch-upload/
│   ├── batch-upload.component.ts
│   ├── batch-upload.component.html
│   ├── batch-upload.component.scss
│   ├── batch-upload.module.ts
│   └── batch-upload-routing.module.ts
├── models/
│   └── batch-upload.model.ts        # TypeScript interfaces
└── services/
    └── batch-upload.service.ts      # HTTP service
```

## Integration

The batch upload utility is fully integrated into the application:

1. **Backend**: BatchModule is imported in AppModule
2. **Frontend**: BatchUploadModule is lazy-loaded via routing
3. **Services**: All backend services (Media, Milestones, Categories) are accessible
4. **Database**: Uses TypeORM with SQLite

## Example Workflow

### Uploading Family Photos

1. Organize your photos and prepare batch data:
   ```json
   {
     "milestones": [
       {
         "title": "Family Vacation 2026",
         "description": "Summer at the beach",
         "eventDate": "2026-06-15",
         "categoryId": 3,
         "mediaFiles": [
           {"filename": "beach_1.jpg", "caption": "Building sandcastle"},
           {"filename": "beach_2.jpg", "caption": "Sunset view"}
         ]
       }
     ]
   }
   ```

2. Navigate to `/batch-upload`
3. Select the 2 image files
4. Fill in milestone details
5. Click "Validate"
6. Click "Upload Batch"
7. View results and confirmation

## Troubleshooting

### Files Not Auto-Populating
- Ensure files are selected before filling milestone details
- Auto-population only happens on the first milestone

### Validation Errors
- Check file names match exactly in batch data
- Verify date format (YYYY-MM-DD)
- Ensure category IDs exist

### Upload Failures
- Check file permissions
- Verify upload directory exists
- Check available disk space
- Review server logs for detailed errors

## Performance Notes

- Large batches (50+ files) may take several minutes
- Progress updates provide real-time feedback
- Server processes one milestone at a time
- Media files are processed sequentially per milestone

## Future Enhancements

- Batch processing with progress bar
- Support for CSV/Excel batch data import
- Scheduled batch uploads
- Batch templates/presets
- Duplicate detection
- Automatic organization by date
