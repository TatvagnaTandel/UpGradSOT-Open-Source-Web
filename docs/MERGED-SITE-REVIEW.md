# Review of the merged site — 3 November 2026

## Verdict

The portal has a more coherent visual foundation after the 3D and motion changes. The main remaining work is task clarity and content trust: program discovery is busy, some sample values look authoritative, and the sample profile button is broken. It is still a browser-local demonstration, not a connected student/admin service.

The program imagery replacement in this branch is complete. The wider improvements below are recommendations for a separate implementation, captured in [the reusable prompt](IMPROVEMENT-PROMPT.md).

## What was actually evaluated

Live source: [published portal](https://tatvagnatandel.github.io/UpGradSOT-Open-Source-Web/), after PR #2 merged into commit `584e0bf`. Inspected the home, programs, program detail, leaderboard and admin demo. Tested the main discovery task at desktop and phone widths, using an existing sample-profile session rather than clearing the user's browser state.

Observed task trace:

1. Home → Programs → search `GSoC`: exactly one matching card.
2. Details opens; close and Escape dismiss it. The official organizer link is present.
3. Clicking the sample profile button opens zero dialogs. Source inspection confirms that its expected `#user-profile-modal` is absent.
4. At 390px, the category filter row contains 838px of options inside a 358px area. Document overflow is zero; this is a discoverability problem, not a page-level horizontal scrollbar.
5. Live detail headers put text over promotional imagery; the phone header clips content. Program images repeat unrelated Cyberhack 2077 and React workshop advertising.

A separate reviewer evaluated the rendered discovery trace against Nielsen's ten heuristics. The table combines that review with measured behavior and the official-source check below. It does not assign a numerical usability score or claim an exhaustive accessibility/performance audit.

## Priority findings

| Priority | Finding | Evidence | Recommended outcome |
| --- | --- | --- | --- |
| P0 | Program data is not reliable enough to present as confirmed | The site lists “Google Season of Docs 2027”; Google's official page says the program has concluded | Archive the concluded program; verify every current cycle against primary sources and record verification dates |
| P0 | Sample profile button silently does nothing | Live click opened zero dialogs; target modal is missing | Restore profile, sample registrations and sign-out with complete keyboard/focus behavior |
| P1 | Demo actions can be confused with organizer registration | Detail modal shows sample capacities and admission-style RSVP/pass actions without a local qualification | Make the official application action primary; label sample counts, XP and passes next to each action |
| P1 | Phone details make the real next step expensive to reach | Organizer action appears after substantial timeline/description content | Put official application immediately below the heading or in an accessible sticky action area |
| P1 | Program cards are difficult to compare quickly | Repeated metadata, long descriptions, many tags and capacity meters make tall cards | Prioritize name, verification state, deadline and format; move secondary information to details |
| P1 | Program imagery contradicts the listing | Generic image says Cyberhack 2077 while the card describes GSoC and other programs | **Addressed here:** 27 distinct local covers and a neutral fallback; no embedded event dates/prizes |
| P1 | Detail headings compete with image text and clip on phones | Rendered live desktop/phone detail screenshots | **Addressed here:** separate artwork from real heading text; content-sized phone header |
| P2 | Some filters are hidden on phones | 838px of chips in a 358px row with little scrolling guidance | Wrap filters or offer an obvious expandable filter panel; preserve the selected state |
| P2 | Search gives limited feedback | One GSoC result appears without an explicit result count | Add an accessible result count, selected-filter summary and clear/reset action |
| P2 | Labels and copy compete with practical information | `WINTEROFCODE`, ambiguous Active/Ongoing language, long marketing claims and a near-invisible terminal input | Use human-readable labels, consistent statuses and task-led copy; correct input contrast |

### Official-source check

Google's [Season of Docs homepage](https://developers.google.com/season-of-docs) states that the program has concluded and describes its historical period as 2019–2024. The site's proposed 2027 cycle should therefore not remain an active opportunity.

The [Google Summer of Code homepage](https://summerofcode.withgoogle.com/) supports the general description of a mentored open-source program. This review did **not** verify the site's 2027 dates, stipend figures or capacity numbers. Do not infer that an organizer link proves the associated seed data is current. The rest of the 27-program dataset still needs a source-by-source review.

## Heuristic evaluation

Passes are limited to the interactions observed. Broader recommendations remain open unless marked addressed above.

| Heuristic | Assessment / location | Severity | Concrete fix |
| --- | --- | --- | --- |
| Visibility of system status | Search/filter selections appear, but result count/summary is missing | Minor | Announce result count and show active filters |
| Match with the real world | Program names conflict with repeated generic promotional artwork | Major, addressed here | Program-specific editorial covers |
| User control and freedom | Detail dialog has close and Escape exits | Pass, limited | Preserve exits and test focus restoration |
| Consistency and standards | Raw category keys and unclear Active/Ongoing distinction | Minor | Normalize category/status terminology |
| Error prevention | Sample admission/capacity data can appear real; concluded program listed as upcoming | Major | Inline demo labels and verified program provenance |
| Recognition over recall | Several phone filters require discovering horizontal scrolling | Minor | Visible filter controls or unmistakable scroll affordance |
| Flexibility and efficiency | Official organizer action is buried on phone details | Major | Move the action next to the heading |
| Aesthetic and minimalist design | Program cards repeat dense text, badges, tags and promotional imagery | Major, imagery addressed here | Reduce card content and prioritize comparison fields |
| Error recognition and recovery | Profile button is a silent no-op | Blocker for profile task | Restore shared profile dialog and useful feedback |
| Help and documentation | Preview banner and organizer-check note explain part of the boundary | Pass, limited | Repeat the relevant qualification inside dialogs/actions |

## Changes implemented in this branch

- 27 original SVG program covers plus one fallback, with a reproducible catalog/generator. They are editorial illustrations, not official organizer logos.
- Existing saved legacy banners resolve to the new program artwork without resetting events or overwriting custom local image paths.
- Card covers are decorative for screen readers because the program name is already a real heading. Dimensions and asynchronous decoding are specified.
- Detail artwork and text use separate surfaces. Phone details omit the decorative image and allow the full heading to determine header height.
- The new SVG set totals 35,906 bytes; the three previous JPGs total 2,854,332 bytes. This is an asset-size comparison, not a measured page-speed result.

Program dates, rewards, capacities, profile behavior and backend integration are intentionally unchanged by this imagery update. Read [IMPROVEMENT-PROMPT.md](IMPROVEMENT-PROMPT.md) for the next implementation brief.
