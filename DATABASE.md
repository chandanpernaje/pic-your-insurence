# Database Setup Guide

## PostgreSQL Configuration

This project uses PostgreSQL with Drizzle ORM for type-safe database operations.

### Prerequisites

1. Install PostgreSQL on your system
2. Create a PostgreSQL database:
   ```bash
   createdb pyc_db
   ```

### Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your PostgreSQL connection string:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/pyc_db
   ```

### Database Migrations

#### Generate Migration
After modifying `src/lib/db/schema.ts`, generate a migration:
```bash
npm run db:generate
```

#### Push Schema to Database
Apply all pending migrations:
```bash
npm run db:push
```

#### Run Specific Migrations
```bash
npm run db:migrate
```

### Database Studio
View and manage your database with Drizzle Studio:
```bash
npm run db:studio
```

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users

### Contacts
- `POST /api/contacts` - Create a contact message

## Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email address
- `name`: User name
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Quotes Table
- `id`: Primary key
- `userId`: Foreign key to users
- `title`: Quote title
- `description`: Quote description
- `amount`: Quote amount
- `status`: Quote status (pending, approved, etc.)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Contacts Table
- `id`: Primary key
- `name`: Contact name
- `email`: Contact email
- `message`: Contact message
- `createdAt`: Timestamp
