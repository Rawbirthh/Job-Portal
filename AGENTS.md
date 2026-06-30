# AGENTS.md

## Structure

Two independent packages with no root `package.json` or monorepo tooling. Run all commands from the package directory (`client/` or `server/`).

| Package | Stack | Dev command | Build command |
|---------|-------|-------------|---------------|
| `client/` | React 19, Vite 8, Tailwind CSS 4, TypeScript 6, TanStack Query | `npm run dev` | `npm run build` |
| `server/` | Express 5, Prisma 7, TypeScript 6, MariaDB, Zod | `npm run dev` | `npm run build` |

## Server

**Database**: MariaDB via Prisma driver adapter (`@prisma/adapter-mariadb`). Not the standard Prisma MySQL connector.

**Prisma client output**: Generated to `server/generated/prisma` (non-default). Import from `../../generated/prisma/client`, not `@prisma/client`.

**Schema changes**:
```
npx prisma migrate dev       # create migration + regenerate client
npx prisma generate          # regenerate client only
npx prisma studio            # GUI (also: npm run prisma:studio)
```

**Config**: Uses `prisma.config.ts` (new format), not embedded `datasource` URL. Env vars loaded via `dotenv/config` at runtime.

**Required env vars** (`.env` in `server/`):
- `DATABASE_URL`, `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`

**TypeScript strictness** beyond defaults:
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`

**Dev server**: `ts-node-dev --respawn src/app.ts` (port 5000).

### Backend architecture (layered)

```
Route → Controller → Validation → Service → Repository → Prisma
```

- **validations/** — Zod schemas. Returns 400 with `error: { field: ["message"] }` on failure.
- **repositories/** — Prisma database calls only. No business logic.
- **services/** — Business logic (e.g. duplicate email check).
- **controllers/** — Thin HTTP layer: parses request, runs validation, calls service, sends response.
- **routes/** — Express route definitions.

### API endpoints

| Method | Path | Body | Notes |
|--------|------|------|-------|
| `GET` | `/users` | — | Returns all users |
| `POST` | `/users` | `{ name, email, password }` | Validates with Zod |
| `PUT` | `/users/:id` | `{ name?, email? }` | Validates with Zod |
| `DELETE` | `/users/:id` | — | Returns 204 |

## Client

**Folder structure**:
```
src/
├── assets/          # Images, fonts, icons
├── components/      # Reusable UI pieces (Navbar, etc.)
├── features/        # Feature-specific logic + UI (self-contained)
│   └── users/       # users.api.ts, useUsers.ts, UserList.tsx, UserForm.tsx
├── hooks/           # Shared custom hooks
├── pages/           # Route-level components (Home, Dashboard)
├── routes/          # Route definitions (React Router)
├── services/        # Axios instance (api.ts)
├── utils/           # Pure helper functions
├── App.tsx          # Navbar + AppRoutes
└── main.tsx         # Entry point (BrowserRouter + QueryClientProvider)
```

**API client**: `services/api.ts` reads `VITE_API_URL` env var (defaults to `http://localhost:5000`).

**Data fetching**: TanStack Query (`@tanstack/react-query`).
- `useQuery` for reads, `useMutation` for writes.
- Mutations call `queryClient.invalidateQueries({ queryKey: ['users'] })` on success.
- Form errors from Zod are caught via Axios error response: `err.response.data.error`.

**Tailwind CSS 4**: Uses `@tailwindcss/vite` plugin (not PostCSS). CSS entry point `src/index.css` uses `@import "tailwindcss"`.

**TypeScript strictness** beyond defaults:
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `erasableSyntaxOnly: true`

**Lint**: `npm run lint` (ESLint with react-hooks + react-refresh plugins). No type-checked lint rules enabled.

**No test framework** is configured in either package.

## Verification order

```
cd client && npm run lint && npm run build
cd server && npx tsc --noEmit    # no lint script defined for server
```
