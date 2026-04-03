# CLAUDE.md

## Project

**scriptorium** is a visual editor for crafting branching game dialogs. Stack: React 19, TypeScript, Tailwind CSS v4, nanostores, ReactFlow, Vite. Built as a SPA.

## Commands

Use `vp` (Vite+) directly. Do not call `pnpm`/`npm` for dev tasks.

> **Cloud environments:** If `vp` is not available globally, use `pnpm exec vp ...` as a fallback. Locally, run `vp` directly.

```bash
vp run build        # full pipeline: clean + tsgo + build
vp run check        # full check: format + lint + typecheck
vp dev              # start dev server
vp build            # production build
vp check            # format + lint (no typecheck)
vp test             # run Vitest (watch mode)
vp test --run       # single run
vp lint             # lint with Oxlint
vp lint --fix       # autofix
vp fmt              # format with Oxfmt
vp install          # install dependencies (after pulling changes)
```

**Composite scripts** (run via `pnpm` or `vp run`):

- `vp run build` — `clean && tsgo && vp build` (full production pipeline)
- `vp run check` — `vp check && vp run typecheck` (full check: fmt + lint + tsgo typecheck)
- `vp run typecheck` — `tsgo --noEmit` (standalone typecheck with TypeScript Go)
- `vp run test:ci` — `vp test --run --coverage`

## Git & GitHub

Conventional commit format throughout. Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `ci`.

**`gh` CLI:** Do not assume it's available — use raw `git` commands if missing.

**No AI footers:** Do not add "Drafted with AI assistance" or similar lines to issue or PR bodies.

### Issue Labels

Each issue gets one **main** label + 0–2 **supportive** labels.

- **Main** (exactly one): `bug`, `feature`, `improvement`, `epic`
- **Supportive** (optional): `UI/UX`, `DX`, `AI`, `wontfix`

### Issues

- **Title**: `<type>: <description>` — e.g. `feat: add dialog node editor`
- **Body**:

  ```
  <4–8 sentence description: what, what's affected, how to reproduce, impact>

  #### Rationale             ← optional
  <why this needs to be fixed or implemented>

  #### References            ← optional

  #### Implementation Notes  ← optional
  <any details, if already planned and described>
  ```

### Commits

- **With issue**: `<Issue Title> #<number>` — e.g. `feat: add dialog node editor #12`
- **Without issue**: `<type>: <description>`
- **Body** (optional): past tense, one line per change, ~2–8 lines, backticks for code refs
- PRs should contain a single commit; squash and force-push before merging unless combining multiple tasks

### Pull Requests

- **Title**: `<type>: <description> #<number>`
- **Body**: concisely explain what and why, no emojis, one blank line between sections.

  ```
  <summary of changes>

  Closes #<number>

  [Claude Code session](<link>)
  ```

## Toolchain

This project uses [Vite+](https://voidzero.dev/vite-plus) (`vp` CLI) wrapping Vite, Vitest, Oxlint, and Oxfmt. All lint/format/test configs live in `vite.config.ts`. Typechecking uses [TypeScript Go](https://github.com/nicolo-ribaudo/typescript-go) (`tsgo`).

**Rules:**

- Import from `vite-plus`, not `vite` or `vitest` (e.g. `import { defineConfig } from 'vite-plus'`, `import { vi } from 'vite-plus/test'`)
- Don't install `vitest`, `oxlint`, `oxfmt`, or `tsdown` directly — Vite+ bundles them
- Use `vp dlx` instead of `npx`/`pnpm dlx`; `vp add`/`vp remove` for dependencies

## Code Standards

Detailed rules in `.claude/rules/`:

- `typescript.md` - TypeScript conventions
- `react.md` - React component patterns
- `tailwind.md` - Styling conventions
- `testing.md` - Test patterns
- `comments.md` - Documentation style

## Skills

- `issue-writer` - Create or modify GitHub issues
- `docs-finder` - Search documentation

## External Docs

Use Context7 MCP for React, TailwindCSS, ReactFlow documentation.
Request specific topics, not full manuals.
