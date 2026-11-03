import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('.');
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.png':'image/png', '.json':'application/json' };
createServer(async (req,res) => {
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file=resolve(root, '.'+pathname);
    if (!file.startsWith(root+sep) && file!==root) throw Error();
    if ((await stat(file)).isDirectory()) file=resolve(file,'index.html');
    const data=await readFile(file);
    res.writeHead(200,{'Content-Type':types[extname(file)] || 'application/octet-stream','Cache-Control':'no-store'}); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(8088,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:8088'));
