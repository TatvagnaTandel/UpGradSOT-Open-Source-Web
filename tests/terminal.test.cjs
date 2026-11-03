const {test}=require('node:test'); const assert=require('node:assert/strict'); const vm=require('node:vm'); const fs=require('node:fs');
test('unknown terminal commands render angle brackets as text in both output lines',()=>{
  const lines=[];
  const document={addEventListener(){},createElement(){return {innerHTML:'',className:''}}};
  const context=vm.createContext({window:{},document,console});
  vm.runInContext(fs.readFileSync('js/app.js','utf8'),context);
  context.window.app.runTerminalCommand('<img src=x onerror=alert(1)>',{appendChild(line){lines.push(line.innerHTML)}});
  assert.equal(lines.length,2);
  assert.ok(lines.every(line=>!line.includes('<img')));
  assert.ok(lines.every(line=>line.includes('&lt;img')));
});
