# UAIP Ala-Too — Project Context / Handoff

## What this project is

UAIP Ala-Too is a course-catalog / academic portal prototype for Ala-Too International University.

Current scope:
- browse courses by program/section and grade/year
- search courses
- open course modal with details
- show elective guidance / elective cards
- prepare the app to move from static mock data to real curriculum data in Supabase

Current stack:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- HeroUI installed for UI system/components
- Supabase for database/backend
- Vercel for preview/production deploys

---

## Branch / workflow model

Current workflow for this repo:
- active development branch: `preview`
- production branch: `main`
- when approved for production: merge `preview` -> `main`

Important branches:
- `preview` -> current active work
- `main` -> production branch
- `CheckPoint-beforeDB` -> checkpoint before Supabase DB integration started
- `preview-inital-point` -> earlier UI rebuild checkpoint

Current branch states at handoff time:
- `preview`: `fa96cc5` — `Add fallback grading systems for live catalog`
- `main`: `e309326` — `Merge preview into main for production`
- `CheckPoint-beforeDB`: `6c05d0b` — last preview state before DB integration

---

## What was done before DB integration

Before the live DB connection, the catalog UI was built as a polished frontend prototype with:
- redesigned cards and modal
- sticky/collapsing modal header
- scroll fades
- OCS placeholder modal
- electives hint modal
- responsive search + grade + section filters
- HeroUI-inspired compact dropdowns
- mobile/desktop layout refinements

That pre-DB checkpoint was preserved in branch:
- `CheckPoint-beforeDB`

Use it if you ever need the clean frontend-only state again.

---

## What was done during DB integration

### 1. New Supabase project created
A new dedicated Supabase project was created for UAIP on Sabyr's newer Supabase account.

The repo is wired to that project through env vars.

### 2. Curriculum schema added
Database layer added under `supabase/migrations/`.

Main schema concepts:
- `academic_programs`
- `elective_groups`
- `catalog_courses`
- `curriculum_offerings`
- `offering_audiences`
- `elective_group_courses`
- `offering_option_courses`
- view: `catalog_offerings_v1`
- view: `catalog_cards_v1`

Core architecture idea:
- **course** = canonical course entity
- **offering** = curriculum occurrence of that course
- **audience** = which programs see that offering

This was done specifically so shared courses across multiple programs do not require naive duplication.

### 3. Import pipeline added
Importer script:
- `scripts/import-curriculum.mjs`

It parses markdown curriculum files and imports them into Supabase.

### 4. Real curriculum data added
Current active dataset lives in:
- `supabase/data/iteration-1/COMCEH.md`
- `supabase/data/iteration-1/COMFCI.md`
- `supabase/data/iteration-1/COMSE.md`
- `supabase/data/iteration-1/COM_Department_Electives.md`

Important:
- `COM_Department_Electives.md` is the active elective source now
- older `IT_Faculty_Electives.md` exists historically, but current import path uses the COM department elective file

### 5. Frontend switched from mock data to live Supabase data
Frontend now loads catalog data from Supabase instead of static mock arrays.

Main files involved:
- `src/lib/supabase/public-client.ts`
- `src/features/course-catalog/load-catalog-offerings.ts`
- `src/features/course-catalog/course-catalog.tsx`

`catalog_cards_v1` is used as a browse-oriented source for the UI so that:
- regular offerings show as normal cards
- elective options show as separate cards
- shared program rows do not explode the UI into ugly duplicates

---

## Current product status

### Working now
- live course catalog is connected to Supabase
- real COM dataset is loaded into DB
- preview deploy is working
- UI is reading DB-backed data
- elective cards are shown from imported option courses
- shared courses are modeled properly at DB level

### Temporary / placeholder pieces
- teachers are mostly not present in real source data yet
- outcomes are not present in real source data yet
- grading breakdowns are not present in real source data yet
- because of that, the UI currently uses **fallback grading systems** to preserve the old UX style

Fallback grading was intentionally added so the catalog still feels complete while the real data source is incomplete.

### Known unresolved data issue
- `DFL 102` appears in curriculum notes/options but is missing from the elective source dataset
- importer currently treats it as unresolved / placeholder-level gap

---

## Current UI behavior

The current UI still keeps earlier UX decisions:
- header style from the refined frontend phase
- compact dropdown filters
- OCS button opens "coming soon" modal
- electives hint modal still exists
- modal collapse/fade behavior from the refined UI passes

Now those UI pieces run on top of real DB-backed content.

---

## Files that matter most

### App / UI
- `src/features/course-catalog/course-catalog.tsx`
- `src/features/course-catalog/components/course-card.tsx`
- `src/features/course-catalog/components/course-modal.tsx`
- `src/features/course-catalog/components/electives-hint-modal.tsx`
- `src/features/course-catalog/components/grade-select.tsx`
- `src/features/course-catalog/components/grading-bar.tsx`
- `src/features/course-catalog/types.ts`
- `src/features/course-catalog/data.ts`

### Supabase integration
- `src/lib/supabase/public-client.ts`
- `src/features/course-catalog/load-catalog-offerings.ts`
- `src/types/database.ts`

### DB / import
- `supabase/migrations/20260409195500_create_curriculum_catalog.sql`
- `supabase/migrations/20260409202500_create_catalog_cards_view.sql`
- `scripts/import-curriculum.mjs`
- `supabase/data/iteration-1/*`

---

## What we are doing now

Current phase is:
- validating the live DB-backed preview
- keeping production untouched for now
- using fallback grading until real grading data is available
- preparing for further refinement of real-data UI/UX

Sabyr explicitly said:
- **do not ship to production yet**

So `main` should remain untouched until explicit production approval.

---

## What to do next

Recommended next steps:

### Option A — continue product refinement on preview
- improve how shared courses are presented visually
- improve elective cards / elective details
- refine modal content for sparse real data
- decide how to surface missing teachers/outcomes more elegantly

### Option B — improve DB model toward iteration 2
- add normalized teachers table
- add normalized grading components table
- add semesters table as first-class entity
- move beyond JSON placeholders for richer data

### Option C — enrich source data
- add real teachers
- add real outcomes
- add real grading components
- fix unresolved `DFL 102`

---

## What you need in another workspace

Minimum to continue development:
1. clone the repo
2. checkout `preview`
3. add the correct env file(s)
4. install dependencies
5. run the app

Basic setup:
```bash
npm install
npm run lint
npm run build
npm run dev
```

If you need DB CLI work too:
```bash
npx supabase db push --password "$SUPABASE_DB_PASSWORD"
npm run curriculum:import
npm run supabase:types
```

---

## Secrets / env you will need

You will need env values for:
- Next public Supabase URL + publishable key
- Supabase service role key
- Supabase project ref
- Supabase DB password

If you want full automation from the new workspace too, you will also want:
- GitHub token
- Vercel token
- Supabase access token

A copy of the needed env was saved separately in Obsidian secrets.

Look in:
- `ObsidianVault/05-resources/Secrets/UAIP-AlaToo env backup.md`

That note is intentionally outside the project repo handoff doc because it contains secrets.

---

## One-line summary

This project started as a refined frontend-only UAIP course-catalog prototype, then evolved into a real Supabase-backed catalog using imported COM curriculum markdown files. The current safe development branch is `preview`, production is not yet updated, and `CheckPoint-beforeDB` preserves the last clean frontend-only state before the live database connection.
