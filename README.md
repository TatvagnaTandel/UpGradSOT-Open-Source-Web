![upGrad School of Technology — Open source starts with us](assets/hero-3d.svg)

# UGSOT Open Source Events

A student community portal for discovering open-source programs, following event countdowns, and exploring a sample student and organizer experience.

[Visit the GitHub Pages preview](https://tatvagnatandel.github.io/UpGradSOT-Open-Source-Web/) · [Production deployment plan](docs/DEPLOYMENT.md) · [Browser audit](docs/SITE-AUDIT.md) · [Merged-site evaluation](docs/MERGED-SITE-REVIEW.md) · [Improvement prompt](docs/IMPROVEMENT-PROMPT.md)

**Current status: static demo.** Profiles, rankings, RSVPs, admin changes and passes are browser-local samples. There is no connected authentication provider or shared database. Program records include organizer-source review dates. Unconfirmed cycles, dates and rewards are explicitly withheld; confirm eligibility and application details on organizer sites. The demo does not collect passwords.

## Explore

| Page | What you can try |
| --- | --- |
| [Home](index.html) | Code sculpture, flagship countdown, directory links, geometry playground |
| [Programs](events.html) | Search and filter programs, event details, pin a countdown, calendar export |
| [Regional fests](fests.html) | Browse the seasonal event dataset |
| [Leaderboard](leaderboard.html) | Sample rankings and student profiles |
| [Admin demo](admin.html) | Edit browser-local sample events, sections and roster |

Choose **Explore demo** to try a sample student or admin profile. The admin demo is publicly accessible and must never contain real student records.

## Program sources and sample profiles

The directory distinguishes source-reviewed facts, unverified dates, historical programs and browser-local edits. Source notes and check dates appear in details. Calendar export and date tracking require a confirmed date; date-only announcements never produce a fabricated seconds countdown. Google Season of Docs is archived.

Sample profiles support saved programs, 2D/3D pass previews and persistent sign-out. Repeated cancel/save actions cannot award extra sample XP. Dialogs contain keyboard focus, isolate the background and restore the opening control. Local edits and deletions survive data-version updates.

Review facts in `data/program-reviews.json`, then run `node scripts/build-program-data.mjs` to regenerate the browser catalog. The `legacy` snapshot detects locally customized records; do not replace it when refreshing organizer facts.

## Program artwork

Programs use 27 distinct local SVG covers and a neutral fallback, with no embedded event dates, prices or official logo claims. Existing saved stock-banner paths resolve to the new artwork without clearing local edits. See [the artwork catalog and regeneration notes](assets/programs/README.md).

## Motion across the website

All five pages reveal below-the-fold headings, cards, rankings and 3D panels once as they enter the viewport while scrolling. Opening content appears immediately. They also share dialog, mobile menu and admin-tab transitions; button feedback; and visible-only countdown digit updates. New search/filter cards are picked up automatically. Supported browsers also cross-fade between pages while the header stays steady.

Motion uses the browser animation API, cancels when keyboard focus enters a moving element, pauses in hidden tabs, and responds immediately to changes in reduced-motion preferences. Content stays accessible if JavaScript or animation support is unavailable. Keyboard focus exposes pending content immediately; reduced-motion and print views show all content without waiting for a scroll.

## 3D with a purpose

The hero uses a beveled code sculpture with warm materials, neutral lighting, and a stable pedestal. The lab presents one geometry at a time. Both support pointer dragging, keyboard rotation, reset and pause. Controls sit outside the canvas so they remain readable on phones.

- **Arrow keys:** rotate the focused canvas. **Home:** reset. **Space:** pause/resume.
- Reduced-motion preferences disable continuous rotation and decorative motion.
- `IntersectionObserver` and page visibility suspend animation off-screen; `ResizeObserver` fits the full object at every aspect ratio.
- Rendering is capped at 1.5 device pixel ratio. Frames use elapsed time rather than monitor refresh rate.
- WebGL failure leaves a static illustration. Passes fall back to the 2D preview.
- Pass scenes release textures, geometry, materials and listeners when closed or replaced.

![Sample pass illustration — no admission validity](assets/badge-3d-pass.svg)

Pass codes are decorative patterns, not scannable QR codes. Their reference strings are not signatures. A production pass needs server-issued registration, a real QR encoder and an authenticated check-in service.

## Run locally

Node.js 22 or newer; no dependency installation or frontend build is required.

```sh
git clone https://github.com/TatvagnaTandel/UpGradSOT-Open-Source-Web.git
cd UpGradSOT-Open-Source-Web
npm run dev
```

Open [localhost:8088](http://127.0.0.1:8088). Run `npm test` for lifecycle and demo-session regressions, and `npm run check` for JavaScript syntax, local asset references and duplicate page IDs.

## Structure

![Current static application architecture](assets/architecture-3d.svg)

```text
index.html / events.html / fests.html / leaderboard.html / admin.html
css/                 Shared layouts, components and 3D presentation
js/three-stage.js    Shared rendering, input, motion and cleanup lifecycle
js/three-hero.js     Code sculpture
js/three-lab.js      Geometry playground
js/three-pass-viewer.js  Sample badge texture and scene
js/store.js          Seed dataset and browser-local demo state
vendor/              Bundled Three.js r128 and GSAP runtimes
assets/              Brand images and self-contained SVG illustrations
docs/                Audit and deployment plan
```

## From demo to a live service

Recommended: keep this frontend, host it on GitHub Pages or Cloudflare Pages, and connect **Supabase Auth + Postgres + Edge Functions**. Enforce student/admin permissions in the database; keep role assignment, admission checks and XP awards on the server. This backend is a planned integration, not included or deployed here.

The [deployment guide](docs/DEPLOYMENT.md) describes the schema, permissions, authentication flow, hosting settings and acceptance checks needed before onboarding real students.

## Project notes

Vendor libraries are bundled; Google Fonts is the remaining external presentation request. The frontend works with system-font fallbacks if fonts cannot load. Local demo data can be cleared with the admin demo's sample reset action. There is currently no repository license grant; preserve upstream vendor notices and add a project license only with the owner's choice.
