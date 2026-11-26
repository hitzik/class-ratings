# דירוג כיתות: Class Ratings

Teachers pick a class and give it a 1–10 score with an optional comment.
Homeroom teachers see all scores their class received this school year.

## Run locally
```bash
npm install
npm run dev      # opens on http://localhost:5173 (and on your LAN, for testing on a phone)
```

## Structure
- `src/data/seed.ts`: teachers + classes (**sample data, replace with the real lists**)
- `src/data/store.ts`: data layer (currently browser localStorage; will switch to Supabase)
- `src/pages/Login.tsx`: pick your name
- `src/pages/GradeClass.tsx`: choose class → score → comment → send
- `src/pages/MyClass.tsx`: homeroom view (period filter, average, list of ratings)
- `supabase/schema.sql`: planned database schema
