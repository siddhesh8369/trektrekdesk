# TrekDesk

TrekDesk is a Vite React trekking platform with a public travel desk, a trekker
submission workspace, an admin review panel, and Supabase PostgreSQL as the
production data source.

## What is included

- Search, region, season, duration, and difficulty filters
- Shortlist state for comparing routes during a browsing session
- A detail desk for route checkpoints, essentials, altitude, risk focus, and season windows
- Trekker accounts that submit trek costs and route information for review
- An admin-only panel that approves submissions into the public travel desk
- Supabase Auth, Row Level Security, schema, and seed SQL for live records
- Netlify build configuration for a static Vite deployment
- A local fallback dataset so the UI is reviewable before Supabase keys exist

## Local run

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Add the Supabase project URL and publishable key to `.env.local` when the
database is ready. Without those values, the app uses `src/data/fallbackTreks.js`.

## Supabase setup

1. Create a Supabase project.
2. In the SQL Editor, run `supabase/schema.sql` before creating trekker accounts.
3. Run `supabase/seed.sql` for starter public trek records.
4. Copy the Project URL and publishable key from Supabase into `.env.local`.
5. Create your first account from the Trekker panel.
6. Promote that account to admin once in the Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id
  from auth.users
  where email = 'your-admin-email@example.com'
);
```

The schema creates:

- `profiles` with `trekker` and `admin` roles
- `trek_submissions` for authenticated trekker submissions
- `treks` for public published routes
- `publish_submission(...)` for the admin publish flow

Row Level Security gives public clients read access only to published trek rows.
Trekkers can insert and read their own submissions. Admin checks use a protected
database role function, not editable browser metadata. Keep secret keys out of
the browser and out of Netlify client environment variables.

## Netlify deploy

1. Push the project to a Git provider and import it into Netlify.
2. Use the configured build command `npm run build` and publish directory `dist`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Netlify
   environment variables.
4. In Supabase Auth URL configuration, add the Netlify production URL for the
   deployed site.
5. Deploy.

The seeded trek copy, prices, months, and route metrics are starter editorial
content. Verify them against your trek operators, safety policy, and permit
requirements before production launch.
