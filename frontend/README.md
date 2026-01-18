# Child Milestone Tracker - Frontend

Angular application for tracking and visualizing child milestone events with photo/video support.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

### Installation

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Start the development server:**
```bash
npm start
```

The application will be available at `http://localhost:4200`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── models/              # TypeScript interfaces
│   │   │   ├── category.model.ts
│   │   │   ├── milestone.model.ts
│   │   │   └── media.model.ts
│   │   ├── services/            # API services
│   │   │   ├── category.service.ts
│   │   │   ├── milestone.service.ts
│   │   │   └── media.service.ts
│   │   ├── pages/               # Feature modules
│   │   │   ├── timeline/        # Timeline view
│   │   │   ├── milestones/      # Milestone management
│   │   │   └── gallery/         # Photo/video gallery
│   │   ├── shared/              # Shared module (Material components)
│   │   ├── app-routing.module.ts
│   │   ├── app.module.ts
│   │   └── app.component.ts
│   ├── environments/            # Environment configs
│   ├── assets/                  # Static assets
│   ├── styles.scss              # Global styles
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

## 🎨 Features

### Timeline View
- **Chronological Display:** Milestones organized by year and month
- **Visual Timeline:** Beautiful vertical timeline with markers
- **Major Milestone Highlights:** Special styling for important events
- **Category Colors:** Color-coded by milestone category
- **Media Previews:** Thumbnail images for milestones with photos
- **Responsive Design:** Works on desktop, tablet, and mobile

### Milestone Management
- **CRUD Operations:** Create, read, update, delete milestones
- **Rich Forms:** Date picker, category selector, major milestone flag
- **Media Upload:** Attach multiple photos/videos to milestones
- **Filtering:** Filter by category and major milestones
- **Detail View:** Full milestone details with all media
- **Inline Media Management:** Add/remove media from detail view

### Gallery
- **Standalone Media:** Photos/videos not tied to specific milestones
- **Tabbed View:** Filter by all media, photos only, or videos only
- **Grid Layout:** Responsive masonry-style grid
- **Quick Upload:** Drag and drop or click to upload
- **Media Actions:** View full size, delete
- **Video Support:** Play videos inline with thumbnails

## 🔧 Configuration

### Environment Variables

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  uploadsUrl: 'http://localhost:3000/uploads',
};
```

For production, edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: '/api',
  uploadsUrl: '/uploads',
};
```

## 🎨 UI/UX Design

### Design System
- **Framework:** Angular Material
- **Theme:** Indigo-Pink (customizable)
- **Typography:** Roboto font family
- **Icons:** Material Icons

### Color Palette
- **Primary:** Indigo (#3f51b5)
- **Accent:** Pink (#ff4081)
- **Warn:** Red (#f44336)
- **Category Colors:** Custom hex colors per category

### Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 📱 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Redirect | Redirects to `/timeline` |
| `/timeline` | TimelineComponent | Chronological milestone timeline |
| `/milestones` | MilestonesListComponent | List all milestones with filters |
| `/milestones/new` | MilestoneFormComponent | Create new milestone |
| `/milestones/:id` | MilestoneDetailComponent | View milestone details |
| `/milestones/:id/edit` | MilestoneFormComponent | Edit milestone |
| `/gallery` | GalleryComponent | Photo/video gallery |

## 🛠️ Development

### Available Scripts

```bash
# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Watch mode
npm run watch
```

### Code Style
- **Linting:** ESLint with Angular rules
- **Formatting:** Prettier (optional)
- **Naming Conventions:**
  - Components: PascalCase (e.g., `MilestoneFormComponent`)
  - Services: PascalCase with Service suffix (e.g., `MilestoneService`)
  - Files: kebab-case (e.g., `milestone-form.component.ts`)

## 📦 Key Dependencies

- **@angular/core:** ^17.0.0 - Angular framework
- **@angular/material:** ^17.0.0 - Material Design components
- **@angular/router:** ^17.0.0 - Routing
- **@angular/forms:** ^17.0.0 - Reactive forms
- **date-fns:** ^3.0.0 - Date formatting utilities
- **rxjs:** ~7.8.0 - Reactive programming

## 🎯 Component Architecture

### Smart Components (Containers)
- Handle data fetching and state management
- Communicate with services
- Examples: `TimelineComponent`, `MilestonesListComponent`

### Presentational Components
- Receive data via `@Input()`
- Emit events via `@Output()`
- Pure display logic

### Services
- API communication
- Business logic
- State management (if needed)

## 🔐 Security Considerations

For production deployment:
- Enable production mode
- Implement authentication guards
- Add CSRF protection
- Sanitize user inputs
- Use HTTPS only
- Implement proper error handling
- Add loading states

## 🚀 Build & Deployment

### Production Build

```bash
npm run build
```

Output will be in `dist/child-milestone-frontend/`

### Deployment Options

1. **Static Hosting (Netlify, Vercel, GitHub Pages):**
   - Build the app
   - Deploy the `dist/` folder
   - Configure redirects for SPA routing

2. **Docker:**
   - Use nginx to serve the built files
   - Configure proxy for API calls

3. **Traditional Server:**
   - Build the app
   - Serve with nginx/Apache
   - Configure reverse proxy for API

### Example nginx config:

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/app/dist/child-milestone-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000/api;
    }

    location /uploads {
        proxy_pass http://localhost:3000/uploads;
    }
}
```

## 📚 Learning Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🐛 Troubleshooting

### Common Issues

**Issue:** Cannot connect to backend
- **Solution:** Ensure backend is running on port 3000
- Check CORS settings in backend
- Verify `apiUrl` in environment config

**Issue:** Images not loading
- **Solution:** Check `uploadsUrl` in environment config
- Verify backend static file serving is enabled
- Check file permissions

**Issue:** Build errors
- **Solution:** Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear Angular cache: `npm run ng cache clean`

## 📝 TODO / Future Enhancements

- [ ] Add authentication/authorization
- [ ] Implement search functionality
- [ ] Add export to PDF feature
- [ ] Create printable timeline view
- [ ] Add milestone templates
- [ ] Implement data backup/restore
- [ ] Add sharing capabilities
- [ ] Create mobile app (Ionic/Capacitor)
- [ ] Add offline support (PWA)
- [ ] Implement real-time sync

