# Ready-to-use improvement prompt

Copy the prompt below into the coding agent working on this repository. Start from the latest main branch after the program-artwork changes have been merged, or explicitly include that branch as the base.

---

Improve the existing upGrad School of Technology Open Source Events portal:

- Repository: https://github.com/TatvagnaTandel/UpGradSOT-Open-Source-Web
- Live site: https://tatvagnatandel.github.io/UpGradSOT-Open-Source-Web/
- Read `docs/MERGED-SITE-REVIEW.md` and `docs/DEPLOYMENT.md` first.

The primary student task is to find an appropriate program, understand whether its information is current, and reach the official application page. The secondary task is to explore a clearly labeled sample profile and event pass. Make those tasks easier while preserving the warm paper background, chapter branding, outlined cards, existing 3D sculpture and accessible site-wide motion.

Keep the current HTML/CSS/JavaScript architecture. Use the applicable design, UX, debugging, accessibility and verification skills. Audit the rendered pages and test the actual flows; do not stop at a proposal. Work in a branch, implement the changes, verify them and open a reviewable pull request. Preserve saved browser data and unrelated user edits.

### 1. Repair content accuracy and provenance first

Review every program against its official organizer sources. Record source URL, checked date, cycle/year and verification state. Google's official Season of Docs page says the program has concluded; archive its historical entry instead of advertising a 2027 cycle. Do not invent the next edition, deadlines, venues, stipend figures, attendance, capacity or registration status for any program. If the next cycle is unannounced, show “Dates not announced” or a clearly marked historical cycle and remove misleading countdowns.

Separate official program facts from the portal's sample registrations and XP. An organizer hyperlink alone is not verification. Replace unsupported marketing claims with specific, supportable copy. Keep a compact verification status visible on each card and details page. Do not rewrite the rest of the calendar merely by shifting all dates into the current year.

### 2. Restore the broken sample profile flow

The header profile button currently calls `openProfileModal()` but no `#user-profile-modal` exists. Restore the shared dialog on every page or provide a working shared profile view. Include the selected sample identity, browser-local registrations, pass access and sign-out. Clicking the button must open exactly one dialog. Support Escape, a visible close control, focus containment, focus restoration to the trigger, and a usable phone layout. Signing out must remain signed out after reload.

Keep the preview password-free. Do not call this authenticated login or promote a user to a real admin through a browser role switch. Production Supabase authentication and server-enforced roles remain a separate integration described in the deployment guide; do not imply that a client-side modal fixes authorization.

### 3. Make program discovery fast

Use a compact card hierarchy: program name, verification/cycle status, next confirmed deadline, format/location, and a clear next action. Move extended descriptions, long tag lists, sample capacity meters and secondary rewards into details. Avoid duplicating the same mode/location three times. Use readable labels such as “Winter of Code,” and distinguish “Applications open,” “Program underway,” “Upcoming” and “Archived.”

At phone widths, make all filters discoverable through wrapping or an obvious expandable filter panel. Add an accessible result count and selected-filter summary, with a clear/reset action. Preserve query/filter state and scroll position when navigating to details and back. Ensure program search, categories and archive filters work together and show a helpful empty state.

### 4. Make official application the primary action

Place “Visit official program” or “Apply on organizer site” directly below the detail heading; on phones it must not require scrolling through the entire timeline and description. Use an accessible sticky action area only if it does not cover content or controls.

Label demo RSVPs, counts, XP and passes at the point of use. A sample pass must not suggest confirmed admission or scannable verification. Preserve useful calendar export and countdown pinning, but only use confirmed dates for authoritative countdowns. Avoid awarding duplicate sample XP on repeated clicks.

### 5. Refine the presentation without another redesign

Keep the new local program covers in `assets/programs/` and their generator/catalog. They are original editorial illustrations, not official logos. Do not return to repeated unrelated Cyberhack/React posters or put unverified dates/prizes into decorative images. Preserve custom local image choices and graceful fallbacks. Keep real titles separate from artwork in detail headers.

Shorten the home headline and supporting copy so the main programs action is easy to find on a phone. Reduce repeated promotional sections. Improve the terminal input's foreground/placeholder contrast. Keep the header steady, text readable, and targets at least 44px where practical.

Preserve restrained staggered entrances, reduced-motion behavior, keyboard-focus safety and off-screen suspension of 3D rendering. Content must remain visible and usable when animation support, fonts or WebGL are unavailable. Avoid adding animation libraries or page-wide parallax.

### 6. Verify the result and report its limits

Add focused regression tests for actual bugs and important behavior. Keep existing tests passing. Run `npm test`, `npm run check` and `git diff --check`. Browser-test home, programs, fests, leaderboard and admin at approximately 390px, 1024px and desktop width. Measure `document.documentElement.scrollWidth - document.documentElement.clientWidth`; it must be zero.

Test program search/filter/empty results, official links, profile open/close/sign-out/reload, sample RSVP/pass access, calendar export, countdown pinning, keyboard focus, reduced motion and back/forward behavior. Inspect the actual rendered images and headings for clipping. Have an independent reviewer critique the final screenshots and task trace.

Deliver the PR, before/after screenshots, a concise change summary, verification results and any remaining limitations. Distinguish implemented demo features from real backend functionality and mark any program records that could not be verified. Do not mark an incomplete backend or unverified calendar as production-ready.

---
