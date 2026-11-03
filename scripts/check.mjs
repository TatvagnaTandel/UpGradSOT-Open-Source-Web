import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
for (const file of await readdir('js')) if (file.endsWith('.js')) execFileSync(process.execPath,['--check',`js/${file}`]);
let links=0;
for (const page of ['index.html','events.html','fests.html','leaderboard.html','admin.html']) {
  const html=await readFile(page,'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const target=match[1].split(/[?#]/)[0];
    if (!target || /^(https?:|data:|mailto:)/.test(target)) continue;
    if(!existsSync(target)) throw Error(`${page}: missing ${target}`); links++;
  }
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length) throw Error(`${page}: duplicate IDs`);
}
console.log(`All application scripts parse; ${links} local page references resolve; page IDs are unique.`);
