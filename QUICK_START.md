# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd pyc
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database

#### Create PostgreSQL Database
```bash
# macOS/Linux
createdb pyc_db

# Windows (in PostgreSQL shell)
CREATE DATABASE pyc_db;
```

#### Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/pyc_db
```

#### Initialize Schema
```bash
npm run db:push
```

### 4. Start Development
```bash
npm run dev
```

Open http://localhost:8081 in your browser

## 📁 Project Structure

```
src/
├── routes/           # Page routes
├── components/       # React components
├── lib/
│   ├── db/          # Database setup
│   ├── server/      # Server functions
│   └── utils.ts     # Utilities
└── styles.css       # Global styles
```

## 📝 Available Commands

```bash
# Development
npm run dev          # Start dev server

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier

# Database
npm run db:push      # Sync schema to database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open database UI
```

## 🗄️ Database Guide

### Create New Table

Edit `src/lib/db/schema.ts`:
```typescript
export const myTable = pgTable("my_table", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});
```

### Sync to Database
```bash
npm run db:push
```

### Add Server Function

Create `src/lib/server/my-feature.server.ts`:
```typescript
import { createServerFn } from "@tanstack/react-start/server";
import { getDb } from "../db/client";
import { myTable } from "../db/schema";

export const getMyData = createServerFn(
  { method: "GET" },
  async () => {
    const db = getDb();
    return await db.select().from(myTable);
  },
);
```

### Use in Component
```typescript
import { getMyData } from "@/lib/server/my-feature.server";

export const MyComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getMyData().then(setData);
  }, []);

  return <div>{/* Render data */}</div>;
};
```

## 🌐 Deployment

### Railway (Recommended)
1. Push code to GitHub
2. Create account at railway.app
3. Connect repository
4. Add PostgreSQL database
5. Set DATABASE_URL environment variable
6. Deploy

### Vercel
1. Push code to GitHub
2. Import project at vercel.com
3. Configure environment variables
4. Choose PostgreSQL provider (Supabase)
5. Deploy

### Docker
```bash
docker build -t pyc-app .
docker run -p 3000:5173 -e DATABASE_URL=... pyc-app
```

## 🔧 Common Tasks

### Check Database Connection
```bash
npm run db:studio
```

### View All Users
```bash
npm run db:studio
# Browse the users table in the UI
```

### Reset Database (Development Only)
```bash
# Drop and recreate
npm run db:drop
npm run db:push
```

### Debug Database Queries
Enable logging in `.env.local`:
```env
DEBUG=drizzle:*
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
PORT=3001 npm run dev
```

### Database Connection Error
- Check `DATABASE_URL` in `.env.local`
- Verify PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### Module Not Found
```bash
rm -rf node_modules
npm install
npm run dev
```

### Build Fails
```bash
npm run lint
npm run build
```

## 📚 Documentation

- [Backend Guide](./BACKEND_GUIDE.md) - Database & server functions
- [Database Setup](./DATABASE.md) - Database schemas
- [Deployment](./DEPLOYMENT.md) - Production deployment
- [Git Guide](./GIT_DEPLOYMENT_GUIDE.md) - Version control
- [Contributing](./CONTRIBUTING.md) - Development guidelines

## 💡 Tips

1. Use `npm run db:studio` frequently to inspect database
2. Always test database migrations locally first
3. Write server functions for type-safe backend code
4. Use TypeScript - let IDE catch errors early
5. Check ESLint before committing: `npm run lint`

## 🆘 Need Help?

1. Check relevant documentation file
2. Review error messages carefully
3. Check `npm run lint` output
4. View `npm run db:studio` for data issues
5. Check GitHub Issues in repository

## 📋 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

For detailed Git guide, see [GIT_DEPLOYMENT_GUIDE.md](./GIT_DEPLOYMENT_GUIDE.md)

---

**Ready to code! Happy building! 🎉**
