# Backend Database Implementation Guide

## Overview

This project uses:
- **TanStack Start** - Server-side rendering framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe database queries

## Server Functions

Server functions are type-safe functions that run on the server and can be called from the client.

### File Structure

```
src/
├── lib/
│   ├── db/
│   │   ├── schema.ts       # Database tables & types
│   │   ├── client.ts       # Connection manager
│   │   └── migrations/     # Auto-generated migrations
│   └── server/
│       ├── users.server.ts    # User operations
│       └── contacts.server.ts # Contact operations
```

## Usage Examples

### Calling Server Functions from Components

```typescript
import { createServerFn } from "@tanstack/react-start/server";
import { getUsers, createUser } from "@/lib/server/users.server";

export function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Call server function from client
    getUsers().then(setUsers);
  }, []);

  const handleAddUser = async () => {
    const newUser = await createUser({
      email: "user@example.com",
      name: "John Doe",
    });
    setUsers([...users, newUser]);
  };

  return (
    <div>
      {/* Render users */}
    </div>
  );
}
```

### Route Loaders

Use server functions in route loaders for data pre-fetching:

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { getUsers } from "@/lib/server/users.server";

export const Route = createFileRoute("/users")({
  loader: async () => {
    return { users: await getUsers() };
  },
  component: UsersPage,
});

function UsersPage() {
  const { users } = useLoaderData({ from: "/users" });
  return <div>{/* Render users */}</div>;
}
```

## Database Queries

### Selecting Data

```typescript
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

const db = getDb();

// Get all users
const allUsers = await db.select().from(users);

// Get specific user
const user = await db.select().from(users).where(eq(users.id, 1));
```

### Inserting Data

```typescript
const result = await db
  .insert(users)
  .values({
    email: "test@example.com",
    name: "Test User",
  })
  .returning();
```

### Updating Data

```typescript
const updated = await db
  .update(users)
  .set({ name: "Updated Name" })
  .where(eq(users.id, 1))
  .returning();
```

### Deleting Data

```typescript
await db.delete(users).where(eq(users.id, 1));
```

## Database Schema

### Users Table
```typescript
{
  id: number;           // Auto-incrementing primary key
  email: string;        // Unique email
  name?: string;        // Optional name
  createdAt: Date;      // Auto timestamp
  updatedAt: Date;      // Auto timestamp
}
```

### Quotes Table
```typescript
{
  id: number;
  userId: number;       // References users.id
  title: string;
  description?: string;
  amount?: string;
  status: string;       // 'pending', 'approved', etc
  createdAt: Date;
  updatedAt: Date;
}
```

### Contacts Table
```typescript
{
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}
```

## Creating New Server Functions

1. Create a file in `src/lib/server/` with `.server.ts` suffix
2. Import `createServerFn` from `@tanstack/react-start/server`
3. Import database utilities

```typescript
import { createServerFn } from "@tanstack/react-start/server";
import { getDb } from "../db/client";
import { myTable } from "../db/schema";

export const myServerFunction = createServerFn(
  { method: "GET" },
  async (param: string) => {
    const db = getDb();
    // Database operations
    return result;
  },
);
```

## Error Handling

All server functions have error handling:

```typescript
try {
  const result = await someOperation();
  return result;
} catch (error) {
  console.error("Error:", error);
  throw new Error("User-friendly error message");
}
```

## Type Safety

Database queries are fully type-safe:

```typescript
// TypeScript knows the exact shape
const user = await getUserById(1);
// user is typed as SelectUser
```

## Database Migrations

### Generate Migration
After modifying `src/lib/db/schema.ts`:
```bash
npm run db:generate
```

### Apply Migrations
```bash
npm run db:push
```

### View Database
```bash
npm run db:studio
```

## Environment Configuration

Required in `.env.local`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/pyc_db
```

## Performance Tips

1. **Connection Pooling** - Reuse database connections via `getDb()`
2. **Lazy Loading** - Only fetch required data in server functions
3. **Type Safety** - Catch errors at compile-time with TypeScript
4. **Index Optimization** - Use proper indexes in schema

## Common Patterns

### Authentication Check
```typescript
export const protectedFunction = createServerFn(
  { method: "POST" },
  async (data, { request }) => {
    const user = await getCurrentUser(request);
    if (!user) throw new Error("Unauthorized");
    // Proceed with authenticated operation
  },
);
```

### Pagination
```typescript
const limit = 10;
const offset = (page - 1) * limit;
const results = await db
  .select()
  .from(users)
  .limit(limit)
  .offset(offset);
```

### Filtering and Sorting
```typescript
import { and, or, like } from "drizzle-orm";

const results = await db
  .select()
  .from(users)
  .where(
    and(
      or(
        like(users.email, "%@gmail.com"),
        like(users.email, "%@yahoo.com"),
      ),
      like(users.name, "%John%"),
    ),
  )
  .orderBy(users.createdAt);
```
