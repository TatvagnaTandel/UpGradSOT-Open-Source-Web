# Deploying the portal with student and admin accounts

## Decision

Retain the existing HTML/CSS/JavaScript frontend. Use **Supabase Auth, Postgres and Edge Functions**, with **Cloudflare Pages** for frontend hosting and branch previews. GitHub Pages can continue serving the frontend during integration. This keeps the application small and avoids a framework rewrite solely to add accounts.

This is a deployment and implementation plan. No Supabase project, production database, authentication service, migration or cloud deployment is included in this change. The current website remains a clearly labeled browser-local demo.

GitHub Pages serves static files; it cannot execute the server-side authorization logic by itself. [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages). Supabase provides authentication and integrates it with database authorization. [Supabase Auth](https://supabase.com/docs/guides/auth).

## Components and responsibilities

| Component | Responsibility |
| --- | --- |
| Static frontend | Public directory, countdown, account screens, student dashboard, admin interface |
| Supabase Auth | Verified email login, password reset or magic link, sessions, optional college Google OAuth |
| Postgres with RLS | Shared records and row permissions, independent of UI visibility |
| Edge Functions / database RPC | Capacity-controlled registration, signed/opaque pass issuance, atomic check-in, XP ledger and audited admin operations |
| Private Storage | Optional protected uploads; use signed URLs with short expiry |

Do not put a service-role/secret key in HTML, JavaScript, source control, a frontend environment variable or a static hosting artifact. The browser receives only the project URL and publishable key. Treat both browser requests and localStorage as untrusted.

## Minimum data model

| Table | Fields and purpose |
| --- | --- |
| `profiles` | Auth user UUID, display name, academic year; student ID only if campus verification actually needs it |
| `user_roles` | User UUID and `student`/`admin`, assigned through a trusted operation; never a writable profile field |
| `events` | Title, dates with timezone, venue, official URL, status, capacity, publication state |
| `registrations` | UUID, user UUID, event UUID, status, created timestamp; unique user/event pair |
| `passes` | Registration UUID, random token digest, expiry, revocation and check-in state |
| `xp_ledger` | User UUID, reason, source reference, awarded amount, awarding admin; unique source to prevent duplicate rewards |
| `audit_log` | Actor, action, target ID and time; no passwords, tokens or unnecessary student details |

Derive rankings from approved XP transactions, not editable browser totals. Return display names and aggregate XP through a separate safe leaderboard view; do not expose email addresses, student IDs, registrations or auth tables publicly.

## Access rules to implement before connecting the UI

Enable row-level security on every exposed table and explicitly grant only required operations. A UI route guard alone does not authorize requests. [Supabase RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security).

| Actor | Allowed |
| --- | --- |
| Guest | Read published events and an opt-in public leaderboard projection |
| Student | Read/update allowed fields on own profile; read own registrations and passes; request registration/cancellation through a controlled operation |
| Admin | Manage events, review minimal roster, issue approved XP, check in valid passes |
| Trusted backend | Bootstrap roles, enforce capacity and uniqueness, issue/revoke passes, write audit records |

Students cannot write roles, XP, check-in state or another student's profile. Anonymous users cannot read the roster. Do not derive admin status from client-submitted metadata or an email string. Bootstrap the first admin against a verified Auth UUID using a trusted dashboard/migration; never by matching a hard-coded address in frontend code. Protect role changes from self-promotion and audit them.

Registration and check-in must be transactions: simultaneous requests cannot exceed capacity or redeem a pass twice. Use a real QR library encoding an opaque pass token, and validate the token with an authenticated scanner. Never place names, emails or student IDs in a public QR URL. A hash computed from public event data is not proof of admission.

## Implementation sequence

1. Create separate development and production Supabase projects. Set the production Site URL and exact auth redirect allowlist for the chosen frontend URL, including the repository subpath if GitHub Pages is retained. Configure a real email provider and enable email verification. Test signup, email confirmation, recovery, logout and session expiry with test identities.
2. Write versioned SQL migrations for the tables, indexes, constraints, RLS, role lookup and transactions. Test policies against anonymous, student A, student B and admin sessions. Deny by default and verify direct REST requests, not just page visibility.
3. Replace the synchronous `ClubStore` authentication and persistence with an async provider adapter. Keep public events readable while signed out. Remove demo role switching and seed roster loading from production mode; never silently fall back to demo when authentication or the database fails.
4. Build account screens with loading/error states and proper focus handling. Use Supabase's supported session flow. A static client stores a browser session, so XSS prevention is essential: remove inline handlers, render user-controlled strings with `textContent`, validate external URLs, and add a strict Content Security Policy. If HttpOnly server-owned session cookies are a requirement, choose a backend-for-frontend runtime instead of claiming a static frontend provides that protection. [Supabase server-side auth](https://supabase.com/docs/guides/auth/server-side).
5. Implement registration, cancellation, pass issuance, check-in and XP operations. Revalidate identity and role on each privileged request. Add rate limits, idempotency and audit events. Verify authorized enrollment if access is limited to campus students; an arbitrary typed student ID is not verification.
6. Replace admin demo CRUD with authorized server calls. Re-check role after session refresh and on every operation. Show an access-denied state for students. A public admin HTML shell is acceptable only if all its data and mutations are protected.
7. Define privacy and retention before importing a real roster: publish what is collected and why, choose an operational retention period, provide profile correction, account export/deletion and opt-in leaderboard visibility. Keep personal records out of Git and avoid real data in preview environments.

## Hosting

### Publish the current static demo on GitHub Pages

In repository **Settings → Pages**, use the existing branch source (`main`, root directory) if configured. Merge the reviewed frontend changes into that branch and wait for the Pages deployment to finish. Relative asset paths already support `/UpGradSOT-Open-Source-Web/`. Do not upload credentials or a real student roster. GitHub Pages does not turn the admin demo into a protected backend.

### Recommended full-service frontend on Cloudflare Pages

Connect this repository, select `main` as production branch, framework **None**, and publish a directory containing the static HTML, CSS, JS, assets, vendor files and event JSON. The repository-root static site requires no framework build; use the dashboard's supported static HTML configuration (the docs use `exit 0` as a no-op build command). [Cloudflare static HTML deployment](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

For production, prepare a dedicated public output directory so internal docs, test files and deployment helpers are not published. Configure a custom domain and HTTPS, preview environment separation and response security headers. Add that exact production origin to Supabase redirect settings. Keep backend secrets in the function runtime's secrets facility, not the static host's public output.

Review current provider quotas and costs against expected students, email volume, database size and uploads before choosing a plan. No paid resources need to be provisioned for the frontend fixes.

## Go-live acceptance

- A student can verify their email, sign in, register once, see only their own pass, cancel and sign out across reloads/devices.
- A student cannot obtain roster data, modify another student, self-promote, award XP or publish events through direct API requests.
- Anonymous requests cannot access private records. Expired/revoked sessions and revoked passes are rejected.
- Two simultaneous registrations cannot oversubscribe an event; two scans cannot both redeem a one-use pass.
- Admin edits persist across devices and produce an audit record. Signed-out admin pages show no private data.
- Database/network failures show an error without reporting a successful RSVP or silently switching to sample data.
- Fonts/WebGL can fail without hiding navigation or registration. Reduced motion, keyboard controls and phone layouts still work.
- Test backup restoration and account deletion/export in staging before importing real students.
