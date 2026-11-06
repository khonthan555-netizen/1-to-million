import fs from 'node:fs/promises';
let html=await fs.readFile('dist/index.html','utf8');
const js=html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
if(!js)throw Error('Build entry missing');
const source=await fs.readFile('dist/'+js[1].replace(/^\//,''),'utf8');
html=html.replace(js[0],()=>`<script type="module">${source.replace(/<\/script/gi,'<\\/script')}</script>`);
for(const match of [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)]){
 let css=await fs.readFile('dist/'+match[1].replace(/^\//,''),'utf8');
 const urls=[...new Set([...css.matchAll(/url\((?:["']?)(\/assets\/[^)'" ]+)(?:["']?)\)/g)].map(m=>m[1]))];
 for(const url of urls){const bytes=await fs.readFile('dist'+url);css=css.split(url).join('data:font/woff2;base64,'+bytes.toString('base64'));}
 html=html.replace(match[0],()=>'<style>'+css+'</style>');
}
html=html.replace(/<link[^>]*rel="icon"[^>]*>/g,'');
await fs.mkdir('artifacts',{recursive:true});await fs.writeFile('artifacts/villa-serein.html',html);await fs.writeFile('artifacts/cloud-house-preview.html',html);
console.log('Standalone Villa Serein: artifacts/villa-serein.html');
