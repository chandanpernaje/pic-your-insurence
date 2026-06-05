# Contributing

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and configure
4. Run database migrations: `npm run db:push`
5. Start dev server: `npm run dev`

## Code Style

- Use ESLint: `npm run lint`
- Format code: `npm run format`
- Follow TypeScript best practices

## Making Changes

1. Create a feature branch: `git checkout -b feature/name`
2. Make your changes
3. Test locally: `npm run dev`
4. Commit: `git commit -m "type: description"`
5. Push: `git push origin feature/name`
6. Create a Pull Request

## Commit Message Format

```
type(scope): description

[optional body]
```

Types: feat, fix, docs, style, refactor, test, chore

Example: `feat(auth): add user login`
