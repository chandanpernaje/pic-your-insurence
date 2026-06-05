# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local with your PostgreSQL credentials
```

### 3. Database Migration
```bash
npm run db:push
```

### 4. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Production Deployment

### Using Railway
1. Connect your repository to Railway
2. Add PostgreSQL add-on
3. Set `DATABASE_URL` environment variable
4. Railway will auto-deploy on push

### Using Vercel + Supabase
1. Push code to GitHub and connect the repo to Vercel.
2. In Vercel, choose the project and set these build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add these Vercel environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Verify your Supabase project has Auth, Database, and Storage configured.
5. Deploy the app and verify `/` loads and `/auth` works.

> Keep the server-only `SUPABASE_*` keys secret in Vercel and do not expose them in client code.

### Using Docker

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

Build and run:
```bash
docker build -t pyc-app .
docker run -p 5173:5173 -e DATABASE_URL=your_db_url pyc-app
```

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - run: npm run db:push
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/pyc_db

# Server
NODE_ENV=production
PORT=5173
```

## Git Workflow

```bash
# Clone repository
git clone <repository-url>
cd pyc

# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create Pull Request on GitHub
```

## Troubleshooting

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running: `psql -U user -d pyc_db`

### Build Failures
- Clear node_modules: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

### Port Already in Use
- Change port: `PORT=3000 npm run dev`

## Monitoring

- Check logs on your deployment platform
- Use Drizzle Studio to inspect database: `npm run db:studio`
