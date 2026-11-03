# Program cover artwork

These are original editorial SVG illustrations for this portal, not official organizer logos or promotional assets. Program names identify the directory entries; no endorsement is implied. Covers intentionally omit event dates, registration counts, prizes and sponsor marks so decorative artwork cannot contradict the actual listing.

`catalog.json` defines the program title lines, palette and illustration motif. Regenerate the tracked SVG files with:

```sh
node scripts/generate-program-artwork.mjs
```

There are 27 program covers and one neutral fallback. They use system fonts, contain no external images or scripts, and need no raster-generation service. Cards treat the covers as decorative because the program name is already available as a real heading. The detail header uses real text on a separate surface for legibility.

Existing saved events with one of the three old stock banners resolve to the matching new seed artwork at render time. This does not reset event records or overwrite locally customized image paths.
