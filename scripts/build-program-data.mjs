import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const reviews = JSON.parse(readFileSync(new URL('data/program-reviews.json', root), 'utf8'));
const current = readFileSync(new URL('js/program-data.js', root), 'utf8');
const start = current.indexOf('const reviews=');
const end = current.indexOf('\nwindow.programCatalog=');
if (start < 0 || end < start) throw new Error('Program catalog wrapper is missing');
writeFileSync(new URL('js/program-data.js', root), current.slice(0, start) + 'const reviews=' + JSON.stringify(reviews) + ';' + current.slice(end));
console.log(`Generated ${Object.keys(reviews).length} reviewed program records.`);
