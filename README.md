# UAIP-AlaToo

The **Unified Academic Information Portal (UAIP)** for **Ala-Too International University**.

## Tech stack (approved)

- **Next.js 16** (App Router)
- **React 19** + **TypeScript 6**
- **Tailwind CSS 4**
- **Supabase**: Postgres + Auth + Storage + Realtime
- **@supabase/ssr** for server-side auth flow
- **TanStack Query** for client-side data caching
- **Zod + React Hook Form** for validation/forms
- **Vitest + Playwright** for testing
- **GitHub Actions CI** (lint, typecheck, test, build)

> Note: `shadcn/ui` + `Radix UI` are intentionally not included yet (can be added later).

---

## Requirements

- **Node.js >= 20.9.0** (recommended: Node **24**)
- npm

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

---

## Environment variables

See `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional, server-only)

---

## Useful scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check
- `npm run test` — unit tests (Vitest)
- `npm run supabase:start` — start local Supabase stack
- `npm run supabase:status` — local Supabase status
- `npm run supabase:types` — generate DB types from local Supabase

---

## Suggested roadmap

1. Define DB schema + RLS policies for `student / teacher / admin`.
2. Implement Auth (email/password + OAuth if needed).
3. Build core modules:
   - dashboard
   - timetable
   - grades
   - announcements
   - profile/settings
4. Add audit logging and role-aware admin panel.

---

## Repository

- GitHub: `Sa6yX/UAIP-AlaToo` (private)
