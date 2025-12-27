# Scriptorium

Visual editor for crafting branching game dialogs. Next.js 15, React 19, tRPC, Prisma, AI SDK, React Three Fiber.

## Monorepo Structure

- `apps/web` - Next.js application
- `packages/ui` - Shared UI components (Storybook)
- `packages/api` - tRPC routers
- `packages/db` - Prisma schema and client

## Commands

```bash
pnpm dev          # Run Next.js dev server
pnpm build        # Build all packages
pnpm check:fix    # Typecheck + lint + format (with auto-fix)
pnpm storybook    # Run Storybook dev server (port 6006)
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Prisma Studio
```

Individual checks:
```bash
pnpm typecheck    # TypeScript only
pnpm lint:fix     # Biome + ESLint with fixes
pnpm format       # Biome format
```

## Critical Constraints

- TypeScript required for all code
- React 19 with Next.js 15 App Router
- TailwindCSS v4 for styling
- tRPC for type-safe API calls
- Prisma for database access
- R3F components must use `'use client'` directive

## Code Standards

Detailed rules in `.cursor/rules/`:
- `typescript.mdc` - TypeScript conventions
- `react.mdc` - React component patterns
- `tailwind.mdc` - Styling conventions
- `structure.mdc` - File structure
- `storybook.mdc` - Story organization
- `comments.mdc` - Documentation style

Architecture overview in `.cursor/docs/architecture.md`.

## Skills

- `npm-release` - Release packages
- `issue-writer` - Create or modify GitHub issues
- `docs-finder` - Search documentation

## External Docs

Use Context7 MCP for Next.js, React, TailwindCSS, tRPC, Prisma, React Three Fiber documentation.
Request specific topics, not full manuals.
