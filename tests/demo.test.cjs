const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const vm=require('node:vm');
function store() { const data=new Map(); const ctx=vm.createContext({window:{},console,localStorage:{getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}}); vm.runInContext(fs.readFileSync('js/store.js','utf8'),ctx); return ctx.window.clubStore; }
test('first visit remains a guest instead of impersonating a sample student',()=>assert.equal(store().getCurrentUser(),null));
test('a password is never accepted by the browser-only demo as authentication',()=>assert.equal(store().login('admin@ugsot.upgrad.edu','anything').success,false));
