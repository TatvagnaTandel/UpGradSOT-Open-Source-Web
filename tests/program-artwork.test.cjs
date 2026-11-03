const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
function load(){
  const storage=new Map();const ctx=vm.createContext({window:{},console,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}});
  vm.runInContext(fs.readFileSync('js/store.js','utf8'),ctx);vm.runInContext(fs.readFileSync('js/events.js','utf8'),ctx);
  return {store:ctx.window.clubStore,manager:ctx.window.eventsManager,storage};
}
test('all seeded programs have distinct local SVG covers with no embedded event dates',()=>{
  const {store,manager}=load();const events=store.getEvents();const images=events.map(e=>manager.getEventBanner(e));
  assert.equal(images.length,27);assert.equal(new Set(images).size,27);
  for(const image of images){assert.match(image,/^assets\/programs\/.+\.svg$/);assert.ok(fs.existsSync(image),image);const svg=fs.readFileSync(image,'utf8');assert.ok(!/2077|Cyberhack|2026|2027/i.test(svg));}
});
test('saved legacy banners resolve to new artwork without overwriting custom event data',()=>{
  const {store,manager,storage}=load();const original=store.getEvents().find(e=>e.id==='evt-gsoc-2027');
  const cached={...original,title:'My saved title',banner:'assets/flagship_banner.jpg'};const before=JSON.stringify([...storage]);
  assert.match(manager.getEventBanner(cached),/^assets\/programs\/.+\.svg$/);
  assert.equal(cached.title,'My saved title');assert.equal(cached.banner,'assets/flagship_banner.jpg');assert.equal(JSON.stringify([...storage]),before);
});
test('custom local artwork is retained while unknown or blocked images use the new neutral fallback',()=>{
  const {manager}=load();assert.equal(manager.getEventBanner({id:'evt-gsoc-2027',banner:'assets/my-custom-cover.svg'}),'assets/my-custom-cover.svg');
  for(const e of [null,{id:'custom'},{id:'custom',banner:'assets/workshop_banner.jpg'},{id:'custom',banner:'https://example.com/image.jpg'}])assert.equal(manager.getEventBanner(e),'assets/programs/program-default.svg');
});
