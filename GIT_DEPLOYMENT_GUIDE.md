# Git & GitHub Deployment Guide

## Initial Setup

### 1. Initialize Git Repository

```bash
cd d:\PYC
git init
git add .
git commit -m "initial commit: PYC insurance app with PostgreSQL"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `pyc-insurance`)
3. Do NOT initialize with README (we have one)
4. Copy the repository URL

### 3. Connect Local to Remote

```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

## Workflow

### Creating Feature Branches

```bash
# Create and switch to new branch
git checkout -b feature/add-user-authentication

# Make changes
# ...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat(auth): add user login with email verification"

# Push to remote
git push origin feature/add-user-authentication
```

### Commit Message Format

```
type(scope): subject

Optional body with more details
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Build/dependencies

**Examples:**
- `feat(api): add user creation endpoint`
- `fix(db): resolve connection pool timeout`
- `docs(readme): update setup instructions`

## GitHub Actions CI/CD

The `.github/workflows/deploy.yml` file is already configured.

### Setting Up Secrets

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add these secrets:

```
DATABASE_URL=postgresql://user:password@host:5432/pyc_db
NODE_ENV=production
```

### Workflow Steps

On every push to main:
1. ✅ Install dependencies
2. ✅ Run ESLint
3. ✅ Build project
4. ✅ Run database migrations
5. 📋 Deploy (configure based on your platform)

## Branching Strategy

```
main (production)
  ↑
  └─ develop (staging)
       ↑
       └─ feature/* (feature branches)
       └─ fix/* (bugfix branches)
```

### Example Workflow

```bash
# Start from develop
git checkout develop

# Create feature branch
git checkout -b feature/add-quote-calculator

# Make changes and commits
git commit -m "feat(calculator): add quote estimation"

# Push feature branch
git push origin feature/add-quote-calculator

# Create Pull Request on GitHub
# After review and approval, merge to develop

# When ready for production
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags
```

## Deployment Strategies

### Railway (Recommended)

1. Create account at https://railway.app
2. Connect GitHub repository
3. Create PostgreSQL database
4. Set environment variables in dashboard
5. Deploy button connects automatically to GitHub
6. Auto-deploys on main branch push

```bash
# Railway configuration
- Runtime: Node.js
- Database: PostgreSQL
- Build: npm install && npm run build
- Start: npm run preview
```

### Vercel

1. Go to https://vercel.com
2. Import GitHub project
3. Configure environment variables
4. Choose PostgreSQL provider (Supabase, Neon, Vercel Postgres)
5. Deploy

```bash
# Vercel config (vercel.json)
{
  "buildCommand": "npm run build && npm run db:push",
  "outputDirectory": "dist",
  "env": ["DATABASE_URL"]
}
```

### Self-hosted with Docker

```bash
# Build image
docker build -t pyc-app:1.0.0 .

# Run container
docker run -d \
  -p 3000:5173 \
  -e DATABASE_URL=postgresql://... \
  -e NODE_ENV=production \
  --name pyc-app \
  pyc-app:1.0.0
```

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create pyc-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

## Rollback Strategy

### If deployment fails:

```bash
# Revert last commit
git revert HEAD

# Force push (use with caution)
git push origin main

# Or manually deploy previous version
git checkout <previous-commit-hash>
git push origin main --force
```

## Monitoring Deployments

### GitHub Actions

1. Go to repository → Actions tab
2. View workflow runs
3. Check logs for each step
4. See deployment status

### Application Monitoring

```bash
# View logs (depends on platform)
# Railway: dashboard
# Vercel: Deployments → Function logs
# Heroku: heroku logs --tail
```

## Secrets Management

Never commit sensitive data:

```bash
# .gitignore ensures these are not committed
.env.local
.env
secrets/
```

Use GitHub Secrets for:
- `DATABASE_URL`
- `API_KEYS`
- `OAuth tokens`
- `Passwords`

## Continuous Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed by team
- [ ] No console errors
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Staging deployment successful
- [ ] Final approval from product owner
- [ ] Merge to main
- [ ] Monitor for issues after deployment

## Troubleshooting

### Push rejected

```bash
# Pull latest changes first
git pull origin main

# Resolve conflicts
# Then push again
git push origin main
```

### Large files

```bash
# Check file size
ls -lh file-name

# Use Git LFS for large files
git lfs install
git lfs track "*.large-extension"
git add .gitattributes
git commit -m "chore: setup git lfs"
```

### SSH key issues

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to GitHub: Settings → SSH and GPG keys
# Test connection
ssh -T git@github.com
```

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
