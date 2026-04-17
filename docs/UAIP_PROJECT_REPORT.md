# UAIP Project Report

_Last updated: 2026-04-17_

> Living handoff document for teammates.
> Update this file when major product, UX, data-model, or workflow changes happen.

### Latest UI update — 2026-04-17

- removed the standalone top header from the catalog page
- changed course cards so badges stay on one horizontal row
- moved `credits`, `semester`, and `OCS` into a dedicated meta row under the badges
- started shifting the UI away from borders toward layered neutral surfaces for the page, controls, cards, and modals

---

## 1. What this project is

**UAIP Ala-Too** is a course catalog / academic information portal prototype for **Ala-Too International University**.

The main idea is to turn hard-to-read curriculum tables, markdown files, and static academic data into a modern, searchable, filterable, student-friendly interface.

Right now, UAIP is **not** a full student portal, LMS, enrollment system, or complete SIS.

At its current stage, it is mainly a **catalog and discovery product** that helps students:

- search courses faster
- filter by program and study year
- understand electives more clearly
- open course details in a clean modal
- browse curriculum data more comfortably than in raw tables or documents

---

## 2. What it was supposed to be

The intended direction of UAIP was:

- a clean academic catalog for students
- much better UX than static curriculum sheets
- a unified view of courses across multiple departments/programs
- support for shared courses between programs
- support for electives and elective categories
- a scalable base for real backend data
- a product that could later grow into a broader academic information platform

Main product hypothesis:

> students should understand their curriculum faster and with less confusion than they do with traditional static curriculum documents.

---

## 3. Problem it tries to solve

Traditional curriculum information is usually painful because:

- it lives in static docs, tables, or messy files
- students cannot search quickly
- electives are hard to understand
- shared courses across programs get messy
- details are fragmented
- visual hierarchy is weak

UAIP tries to solve that with:

- search
- filters
- structured course cards
- detailed modal views
- better visual grouping
- clearer elective handling
- a scalable backend data model

---

## 4. Current stack

### Frontend
- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **HeroUI**
- **TanStack React Query**
- **react-hook-form**
- **zod**

### Backend / data
- **Supabase**
- PostgreSQL via Supabase
- curriculum data imported from markdown sources

### Tooling / infra
- **Vercel** for deployments
- **Supabase CLI**
- **ESLint**
- **Prettier**
- **Vitest**
- **Playwright** is present in dependencies
- Node engine: **>= 20.9.0**

---

## 5. Branch / workflow model

Important workflow rule for this repo:

- **`preview`** = active development branch
- **`main`** = production branch

Standard flow:

1. work in `preview`
2. validate changes there
3. merge `preview -> main` when production shipment is approved

Important branches:

- `preview`
- `main`
- `CheckPoint-beforeDB`
- `preview-inital-point`

### Meaning of the special branches

- **`CheckPoint-beforeDB`**
  - preserved checkpoint from before live database integration
  - useful if someone needs the polished frontend-only state

- **`preview-inital-point`**
  - earlier UI rebuild checkpoint

---

## 6. Project evolution

### Phase 1 — frontend prototype

The first strong version of UAIP was a polished UI-only prototype.

Main focus during that phase:

- redesigning the catalog UI
- responsive layout
- card design
- modal design
- filter UX
- better spacing and typography
- motion and fade refinements
- elective hint modal
- OCS placeholder modal
- mobile improvements

This phase created a strong frontend experience before real backend data was connected.

That state was preserved in:

- **`CheckPoint-beforeDB`**

### Phase 2 — live DB integration

After the UI became strong enough, the project moved to real data.

This phase added:

- Supabase project integration
- database schema
- importer script
- real curriculum data import
- typed DB access
- live catalog loading from Supabase

This was the big shift from:

- static mock arrays

into:

- live DB-backed catalog data

### Phase 3 — data expansion

After the initial COM programs were integrated, the scope expanded to more departments/programs.

Programs included in the broader catalog work:

- COMCEH
- COMFCI
- COMSE
- EIMIT
- MATDAIS
- MATMIE

Electives also evolved from older sources toward a combined, more useful department-aware source.

---

## 7. Current architecture

The project intentionally moved away from the naive idea of:

> one course = one department

because that breaks when the same subject is shared across multiple programs.

The database concept is closer to:

- **catalog course**
- **curriculum offering**
- **offering audience**

### Meaning

- **catalog course** = canonical course entity
- **curriculum offering** = occurrence of that course inside curriculum structure
- **offering audience** = which programs/groups see that offering

This makes it possible to represent shared subjects more cleanly without ugly duplication.

---

## 8. Database layer

Main entities currently used in the DB layer:

- `academic_programs`
- `elective_groups`
- `catalog_courses`
- `curriculum_offerings`
- `offering_audiences`
- `elective_group_courses`
- `offering_option_courses`

Views:

- `catalog_offerings_v1`
- `catalog_cards_v1`

### Why `catalog_cards_v1` matters

This view is important because it makes frontend browsing easier.

It helps the UI render:

- regular course cards
- elective option cards
- browse-friendly output without exposing raw duplicated audience rows directly in the UI

So it is a **frontend-oriented browsing view**, not just raw normalized storage.

---

## 9. Import pipeline

Importer script:

- `scripts/import-curriculum.mjs`

Purpose:

- read markdown curriculum files
- parse curriculum rows
- parse electives
- build normalized records
- import them into Supabase

Useful commands:

```bash
npm run curriculum:import
npm run supabase:types
npx supabase db push --password "$SUPABASE_DB_PASSWORD"
```

---

## 10. Current data sources

The project uses curriculum markdown files stored under:

- `supabase/data/iteration-1/`

Important files include:

- `COMCEH.md`
- `COMFCI.md`
- `COMSE.md`
- `EIMIT.md`
- `MATDAIS.md`
- `MATMIE.md`
- combined elective source files used during the expanded import work

### Elective-source note

Elective handling went through iterations.

The active direction became a combined department-aware elective source so that:

- repeated electives are handled better
- category badges are clearer
- duplicated option rows are reduced

---

## 11. Current frontend functionality

### Search
Students can search by:

- course title
- course code
- teacher name when data exists

### Filters
Students can filter by:

- grade / year
- program / section

Programs handled in the expanded work include:

- COMCEH
- COMFCI
- COMSE
- EIMIT
- MATDAIS
- MATMIE

### Course cards
The main page shows cards with information such as:

- course title
- course code
- credits
- short description
- badges
- teacher preview
- grading preview bar
- OCS button

### Course modal
Clicking a course opens a modal with:

- full title
- description
- teacher section
- grading breakdown
- skills / outcomes section
- chips / badges
- cleaner reading experience than the card view

### Elective handling
Electives are treated as a separate important part of the experience.

Current elective logic includes:

- elective cards
- category badges such as:
  - `AE`
  - `NAE`
  - `NTE`
- department-family badges where relevant

### OCS placeholder
There is an `OCS` button, but it is **not connected yet**.

Current behavior:

- opens a placeholder modal
- communicates that the OCS integration is planned for later

### Density toggle
A compact density toggle was added near filters.

Purpose:

- reduce visible information density when needed
- toggle whether cards show heavier detail like descriptions and grading previews

### Maze snippet
Maze heatmap / usability-testing snippet was added to the site.

Purpose:

- support usability testing
- collect behavior insights for refinement

---

## 12. Important UI/UX work already done

A lot of small refinement work happened over time. Examples include:

- modal description collapse animation refinement
- scroll fade tuning
- filter placement refinement
- more compact mobile filter layout
- compact HeroUI-style dropdowns
- spacing improvements around search and controls
- button and icon refinements
- typography improvements
- blue OCS button styling
- electives hint moved into popup/modal pattern
- horizontal filter fade improvements
- stronger mobile responsiveness
- header removal for a cleaner first screen
- one-line badge treatment on cards
- card meta row separation for credits / semester / OCS
- neutral layered surface direction replacing visible borders in key UI surfaces

This matters because UAIP is not just “data connected to UI” — it already went through real iterative UI polish.

---

## 13. Current placeholder / fallback logic

Some real academic data is still incomplete.

### Common missing / weak source areas
- many teachers are still missing
- outcomes / skills are incomplete
- official grading breakdowns are incomplete
- some metadata still comes from early draft curriculum sources

### Current UI strategy
To avoid an empty-feeling UI, the project uses:

- **fallback grading systems**

Important note:

These are useful UX placeholders.
They are **not yet authoritative official academic grading data**.

---

## 14. What has already been done

In practical terms, the team has already done the following:

- built the frontend catalog UI
- polished search, filters, cards, and modal experience
- added electives hint flow
- added OCS placeholder flow
- added density toggle
- connected the project to Supabase
- designed and added curriculum catalog schema
- built import pipeline for markdown curriculum data
- switched frontend from mock data to live DB-backed data
- expanded the project beyond the initial COM-only scope
- prepared the site for usability testing with Maze
- established a preview/production branch workflow

---

## 15. What we wanted to do / future direction

UAIP is not conceptually finished.

Natural next directions include:

### Product / UX
- improve presentation of shared courses
- better distinguish regular offerings vs elective items
- improve modal behavior when real data is sparse
- improve clarity for students seeing curriculum structure for the first time

### Data model
Potential future improvements:

- normalize teachers into proper tables
- normalize grading components
- add semesters as first-class entities
- improve metadata quality
- support richer curriculum versioning

### Integrations
- connect OCS or equivalent real system
- move beyond passive catalog toward more actionable academic flows

### Research / validation
- run Maze tests with students
- collect confusion points
- refine based on actual user behavior

---

## 16. What the project currently is not

To avoid confusion for teammates:

UAIP is **not yet**:

- a full course registration system
- a final authoritative academic portal
- a complete source of official grading truth
- a production-grade institutional admin system
- a fully developed SIS / ERP layer

UAIP is currently:

- a strong UX-first academic catalog prototype
- backed by real data infrastructure
- ready for iteration, testing, and refinement

---

## 17. Key files teammates should know

### Frontend / UI
- `src/features/course-catalog/course-catalog.tsx`
- `src/features/course-catalog/components/course-card.tsx`
- `src/features/course-catalog/components/course-modal.tsx`
- `src/features/course-catalog/components/electives-hint-modal.tsx`
- `src/features/course-catalog/components/grade-select.tsx`
- `src/features/course-catalog/components/grading-bar.tsx`
- `src/features/course-catalog/data.ts`
- `src/features/course-catalog/types.ts`
- `src/features/course-catalog/load-catalog-offerings.ts`

### Supabase integration
- `src/lib/supabase/public-client.ts`
- `src/types/database.ts`

### DB / import
- `scripts/import-curriculum.mjs`
- `supabase/migrations/20260409195500_create_curriculum_catalog.sql`
- `supabase/migrations/20260409202500_create_catalog_cards_view.sql`
- `supabase/data/iteration-1/*`

### Context docs
- `PROJECT-CONTEXT.md`
- `docs/UAIP_PROJECT_REPORT.md`

---

## 18. Operational notes for teammates

To continue development, a teammate generally needs:

1. clone the repo
2. checkout the correct branch
3. add env files / secrets
4. install and run

Typical flow:

```bash
npm install
npm run lint
npm run build
npm run dev
```

If DB work is needed:

```bash
npx supabase db push --password "$SUPABASE_DB_PASSWORD"
npm run curriculum:import
npm run supabase:types
```

Important branch rule:

- do development in `preview`
- merge to `main` when approved for production

---

## 19. Current overall status

At this point UAIP is:

- visually quite refined
- backed by real Supabase data
- expanded beyond the initial smaller scope
- prepared for usability testing via Maze
- iterated many times in UI
- viable as a strong academic catalog prototype

In short:

> UAIP started as a polished frontend prototype and evolved into a live DB-backed academic catalog product with real curriculum imports, elective modeling, multi-program support, and a preview/production workflow.

---

## 20. Short summary for teammates

**UAIP is a Next.js + Supabase academic course-catalog product for Ala-Too that transforms curriculum markdown/table data into a searchable, filterable, student-friendly interface. It began as a frontend prototype, then gained a real DB/import pipeline, expanded to multiple departments, added elective modeling and shared-course handling, and is now in an iterative polish/testing stage rather than being a finished institutional system.**

---

## 21. Maintenance note

This file should be updated when any of the following changes happen:

- major product direction changes
- new program / department data is added
- schema or import pipeline changes
- important UI/UX changes ship
- workflow / branching rules change
- production status meaningfully changes

Treat this as the main teammate-facing handoff doc unless a better docs structure is introduced later.
