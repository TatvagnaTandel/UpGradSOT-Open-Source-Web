# Site audit — 3 November 2026

Inspected the deployed homepage in the browser and scrolled from the hero through the content, terminal and geometry lab. Reviewed the other page shells and their controllers in the repository.

## Findings and changes

| Finding | Cause | Change |
| --- | --- | --- |
| Neon cyan geometry appears flat/blown out | Multiple intense colored lights, emissive surfaces and shiny materials | Neutral key/fill lights, restrained materials, tone mapping and explicit color encoding |
| Hero is visually cluttered | Nested transparent solids, rings, satellites, particles and floor grid compete | One beveled code sculpture and pedestal matching chapter colors |
| “Drag meshes” hint is misleading | Hero had mouse parallax and clicks, no drag implementation | Pointer capture rotation, touch support, keyboard equivalents and accurate instructions |
| Geometry can clip on narrow canvases | Camera distance stays fixed when aspect changes | Fit a bounding sphere against the smaller horizontal/vertical view angle |
| GPU keeps working outside the scene | Lab always requests frames; hero only skips drawing | Cancel/restart frames by intersection and document visibility; clamp elapsed-time steps |
| Motion is unavoidable | No reduced-motion gate or lab pause | Respect device preference; external pause/reset controls; stable content cards/buttons |
| HUD crowds the scene on phones | Absolute control rows and long no-wrap hints | Wrapping toolbar below canvas, minimum 44px controls |
| Unsupported WebGL leaves an empty frame | Renderer initialization has no failure UI | Static illustration; pass falls back to printable 2D |
| Repeated pass opens leak and can fail to render | Constructor captures canvas before modal markup exists; window listeners/materials persist | Acquire current canvas on each open and share lifecycle/disposal logic |
| Demo looks authenticated | First visit impersonates a seed student; password is ignored; role switches are public | Guest first visit, explicit password-free demo selector and sample labels |
| README implies production auth/verified passes | Marketing claims don't match localStorage and decorative code patterns | Accurate status, readable static diagrams and a separate production deployment plan |

The remaining local demo CMS is intentionally public and browser-local. It is not an authorization boundary. The full-service backend is documented, not implemented. Event seed schedules, sample attendance/capacities, prizes and student achievements have not been verified against organizers; the UI and README identify the preview as sample content.

## Verification

`npm test` exercises viewport framing, animation suspension, motion preferences, pointer interaction, context failure, disposal and demo sessions. `npm run check` validates JavaScript parsing, local page references and unique page IDs. Browser QA covers home, directory, sample profile/pass and admin demo, plus phone/tablet overflow and rendered SVG documentation assets.

## Follow-up: motion across all pages

The shared motion controller now reveals headings, directory cards, sample rankings and admin metrics as they enter the viewport. It discovers newly rendered search/filter cards, keeps keyboard-focused content still, pauses running effects in hidden tabs and cancels effects immediately when reduced motion is enabled. No CSS hides content while waiting for JavaScript. Dialogs, mobile navigation and admin tabs use short opacity/translation transitions; supporting browsers cross-fade between pages while the header stays fixed. Hover feedback is limited to devices with a fine pointer.

The controller uses the native Web Animations API and does not require GSAP. Six motion regression tests cover first-entry behavior, dynamic cards, changing preferences, focus and tab visibility. Browser frame captures verify staggered opacity changes rather than merely checking that animation code exists.
