# Docker Deployment Guide

## Quick Start

### Prerequisites
- Docker Desktop (or Docker Engine) installed
- Docker Compose installed

### Building and Running

1. **Build all services:**
   ```bash
   docker-compose build
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000/api
   - Backend Health: http://localhost:3000/api/health

4. **Seed categories (first time only):**
   ```bash
   curl -X POST http://localhost:3000/api/categories/seed
   ```

5. **View logs:**
   ```bash
   # All services
   docker-compose logs -f

   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

6. **Stop services:**
   ```bash
   docker-compose down
   ```

## Service Details

### Backend (NestJS)
- **Port:** 3000
- **Base Image:** node:20-alpine
- **Build:** Multi-stage build (reduces image size)
- **Volumes:**
  - `backend_uploads`: Persistent storage for media files
  - `backend_data`: SQLite database storage
- **Environment Variables:** Configured in docker-compose.yml
- **Health Check:** Checks `/api/health` endpoint every 30 seconds

### Frontend (Angular)
- **Port:** 80
- **Base Image:** nginx:alpine
- **Build:** Multi-stage build (Node builder → Nginx server)
- **Nginx Configuration:** Includes:
  - Gzip compression
  - Cache headers for static assets
  - API proxy to backend service
  - SPA routing fallback
- **Health Check:** Checks index.html availability

## Docker Compose Features

- **Named volumes** for persistent data storage
- **Health checks** for automatic restart on failure
- **Service dependencies** (frontend waits for backend)
- **Custom network** for inter-service communication
- **Restart policy** ensures services recover from crashes

## Troubleshooting

### Backend fails to start
```bash
# Check logs
docker-compose logs backend

# Verify volume permissions
docker-compose exec backend ls -la /app/data
docker-compose exec backend ls -la /app/uploads
```

### Frontend shows blank page
```bash
# Check Nginx logs
docker-compose logs frontend

# Verify build output
docker-compose exec frontend ls -la /usr/share/nginx/html
```

### API calls failing from frontend
```bash
# Test backend connectivity
docker-compose exec frontend wget -O- http://backend:3000/api/health

# Check Nginx proxy configuration
docker-compose exec frontend cat /etc/nginx/nginx.conf
```

### Clean rebuild
```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## Production Considerations

### Security
- Use environment variables for sensitive configuration
- Set `NODE_ENV=production` for backend
- Consider using Docker secrets or external secret management
- Implement API rate limiting and authentication
- Use HTTPS in production (configure in Nginx)

### Performance
- Implement caching strategies
- Monitor resource usage: `docker stats`
- Consider horizontal scaling with load balancer
- Use CDN for static assets in production

### Monitoring
- Implement centralized logging (ELK stack, Splunk, etc.)
- Set up application performance monitoring (APM)
- Use `docker-compose logs` for basic debugging
- Configure log rotation to prevent disk space issues

## Manual Image Building

Build individual images without docker-compose:

```bash
# Backend
docker build -t child-milestone-backend:latest ./backend

# Frontend
docker build -t child-milestone-frontend:latest ./frontend

# Run backend
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -v backend_uploads:/app/uploads \
  -v backend_data:/app/data \
  child-milestone-backend:latest

# Run frontend
docker run -d -p 80:80 \
  child-milestone-frontend:latest
```

## Volumes and Persistence

### Backend Volumes
- **backend_uploads**: Media files (images, videos, thumbnails)
- **backend_data**: SQLite database

To backup:
```bash
docker run --rm -v backend_uploads:/data -v $(pwd):/backup \
  alpine tar czf /backup/uploads.tar.gz -C /data .

docker run --rm -v backend_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/database.tar.gz -C /data .
```

## Environment Variables Reference

See `backend/.env.example` for backend configuration options:
- `DB_DATABASE`: Database file path
- `UPLOAD_DIR`: Upload directory path
- `ALLOWED_IMAGE_TYPES`: Comma-separated MIME types
- `ALLOWED_VIDEO_TYPES`: Comma-separated MIME types
- `MAX_FILE_SIZE_MB`: Maximum upload size
- `NODE_ENV`: Environment (development/production)
