# Scriptorium Architecture

## Overview

Scriptorium is a visual editor for crafting branching game dialogs. Built as a full-stack monorepo with Next.js, React 19, tRPC, and PostgreSQL.

## Core Layers

### Frontend Layer
- **Framework**: Next.js 15 with App Router
- **UI**: React 19 + TailwindCSS 4
- **3D Visualization**: React Three Fiber for node-based dialog editing
- **State**: React Query (via tRPC) for server state, React state for UI

### API Layer
- **Protocol**: tRPC for end-to-end type safety
- **Transport**: HTTP batching with superjson serialization
- **AI Integration**: Vercel AI SDK with SSE streaming

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Prisma 6
- **Schema**: Users, Projects, Dialogs with JSON content

## Monorepo Structure

```
scriptorium/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── ui/               # Shared UI components (Storybook)
│   ├── api/              # tRPC routers
│   └── db/               # Prisma schema and client
```

## Key Decisions

### 1. Monorepo with pnpm Workspaces
Enables code sharing between packages while maintaining clear boundaries.

### 2. tRPC for API
Type-safe API calls without code generation. Changes to API automatically reflect in client types.

### 3. React Three Fiber for 3D
Dialog trees rendered as interactive 3D node graphs. Enables intuitive visual editing.

### 4. AI-Assisted Writing
Vercel AI SDK provides streaming text generation for dialog suggestions.

### 5. Storybook for Components
Component development and documentation in isolation.

## Technology Stack

- **Runtime**: Node.js 22+
- **Package Manager**: pnpm 10+
- **Language**: TypeScript 5.9
- **Bundler**: Turbopack (Next.js), Vite (Storybook)
- **Styling**: TailwindCSS 4, class-variance-authority
- **Linting**: Biome 2, ESLint 9
- **Git Hooks**: Husky, lint-staged

## Data Flow

1. **Client** → tRPC React hooks
2. **API Route** → tRPC server adapter
3. **tRPC Router** → Prisma queries
4. **Database** → PostgreSQL

For AI features:
1. **Client** → AI SDK useChat hook
2. **API Route** → Vercel AI SDK streamText
3. **OpenAI API** → SSE response stream

## Development

```bash
pnpm dev          # Start Next.js dev server
pnpm storybook    # Start Storybook
pnpm db:studio    # Open Prisma Studio
pnpm check:fix    # Typecheck + lint + format
```
