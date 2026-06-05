# PYC Application

A modern web application built with TanStack Start, TypeScript, and PostgreSQL.

## Features

- 🎨 Beautiful UI with Shadcn components
- 🔄 Server-side rendering with TanStack Start
- 🗄️ PostgreSQL database with Drizzle ORM
- 📝 Form validation with React Hook Form
- 🎯 Type-safe API routes
- 📱 Responsive design with TailwindCSS

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Setup

1. Install dependencies:
```bash
npm install
```

2. Setup environment:
```bash
cp .env.example .env.local
# Edit .env.local with your PostgreSQL credentials
```

3. Initialize database:
```bash
npm run db:push
```

4. Start development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate database migrations
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
src/
├── components/     # React components
├── routes/        # Page routes and API endpoints
├── lib/           # Utilities and database
├── hooks/         # Custom React hooks
└── styles/        # Global styles
```

## Database

The application uses PostgreSQL with Drizzle ORM. See [DATABASE.md](./DATABASE.md) for detailed documentation.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
