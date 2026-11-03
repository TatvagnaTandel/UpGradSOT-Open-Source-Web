// Original local SVG illustrations; no external logos, fonts, dates or image services.
import { readFile, writeFile } from 'node:fs/promises';
const catalog = JSON.parse(await readFile(new URL('../assets/programs/catalog.json', import.meta.url), 'utf8'));
const themes = {
  paper: ['#f5eee0','#a83f45','#e7afb4'], blue: ['#e6edf0','#386b80','#b1cbd5'],
  sage: ['#e6ece4','#426353','#b4cbb8'], rose: ['#f4e5e9','#a34665','#e3adc0'],
  sand: ['#f3e8c9','#896125','#dfbd73']
};
const motifs = {
  branch: '<path d="M45 30v160m0-70c0-65 140 0 140-75" fill="none"/><circle cx="45" cy="30" r="23"/><circle cx="45" cy="190" r="23"/><circle cx="185" cy="45" r="23"/>',
  code: '<rect x="8" y="30" width="216" height="162" rx="18"/><path d="m78 77-35 34 35 34m78-68 35 34-35 34m-28-78-20 88" fill="none"/><path d="M30 49h8m13 0h8" fill="none"/>',
  cloud: '<path d="M45 180h140a39 39 0 0 0 0-78 64 64 0 0 0-124-5 42 42 0 0 0-16 83Z"/><path d="m84 139 30-30 30 30m-30-28v67" fill="none"/>',
  people: '<path d="M45 52h140M45 52l70 140 70-140" fill="none"/><circle cx="45" cy="52" r="29"/><circle cx="185" cy="52" r="29"/><circle cx="115" cy="192" r="29"/><circle cx="115" cy="115" r="11" fill="currentColor" stroke="none"/>',
  book: '<path d="M115 45Q65 12 18 35v150q48-20 97 15 49-35 97-15V35q-47-23-97 10Z"/><path d="M115 45v155M43 68q25-6 47 10M43 99q25-6 47 10m50-31q22-16 47-10m-47 41q22-16 47-10" fill="none"/>',
  orbit: '<circle cx="115" cy="115" r="64"/><ellipse cx="115" cy="115" rx="112" ry="34" transform="rotate(-32 115 115)" fill="none"/><circle cx="192" cy="61" r="18" fill="#faf7ef"/><path d="M22 25h24m-12-12v24m160 158h24m-12-12v24" fill="none"/>',
  blocks: '<path d="m115 15 90 52v103l-90 52-90-52V67Z"/><path d="m25 67 90 52 90-52m-90 52v103M70 41l90 52v103" fill="none"/>',
  coin: '<circle cx="115" cy="115" r="100"/><circle cx="115" cy="115" r="76" fill="none"/><path d="M87 59v112m-15-98h58c39 0 39 42 0 42H87m0 0h48c40 0 40 42 0 42H72m35-106v22m21-22v22m-21 84v22m21-22v22" fill="none"/>',
  grid: '<rect x="20" y="20" width="190" height="190" rx="20"/><path d="M83 20v190m64-190v190M20 83h190M20 147h190" fill="none"/><circle cx="115" cy="115" r="18" fill="#faf7ef"/>',
  civic: '<path d="m15 73 100-56 100 56ZM28 196h174v20H28Zm20-107h23v87H48Zm56 0h23v87h-23Zm56 0h23v87h-23Z"/>',
  spark: '<path d="m115 10 24 79 81 26-81 25-24 80-25-80-80-25 80-26Z"/><circle cx="190" cy="30" r="13" fill="#faf7ef"/><circle cx="25" cy="195" r="13" fill="#faf7ef"/>'
};
const escape = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
for (const item of catalog) {
  const [background,accent,tint] = themes[item.theme];
  const title = item.lines.join(' ');
  const size = Math.min(60, Math.floor(530 / (Math.max(...item.lines.map(line => line.length)) * .56)));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="480" viewBox="0 0 960 480" role="img" aria-labelledby="title desc">
<title id="title">${escape(title)}</title><desc id="desc">Original editorial program cover with a ${escape(item.motif)} illustration. Not an official organizer logo.</desc>
<rect width="960" height="480" fill="${background}"/>
<path d="M60 135h54" stroke="${accent}" stroke-width="7"/>
<g fill="#1c2726" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="${size}">
${item.lines.map((line,i)=>`<text x="60" y="${220+i*68}">${escape(line)}</text>`).join('\n')}
</g>
<text x="60" y="352" fill="${accent}" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="18" letter-spacing="1">${escape(item.label)}</text>
<g transform="translate(680 144)" stroke="${accent}" stroke-width="8" fill="${tint}" color="${accent}" stroke-linecap="round" stroke-linejoin="round">${motifs[item.motif]}</g>
<path d="M60 409h840" stroke="${accent}" stroke-opacity=".2" stroke-width="2"/>
<text x="60" y="445" fill="#4b5550" font-family="Arial,Helvetica,sans-serif" font-size="16" letter-spacing="2">UGSOT / PROGRAM SERIES</text>
</svg>\n`;
  await writeFile(new URL(`../assets/programs/${item.id}.svg`,import.meta.url),svg);
}
console.log(`Generated ${catalog.length} local program covers.`);
