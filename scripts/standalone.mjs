import fs from 'node:fs/promises';
let html = await fs.readFile('dist/index.html', 'utf8');
const js = html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
if (!js) throw Error('Build entry script missing');
const source = await fs.readFile(`dist/${js[1].replace(/^\//, '')}`, 'utf8');
const base64 = (await fs.readFile('dist/models/test-scene.glb')).toString('base64');
html = html.replace(js[0], () => `<script>window.CLOUD_HOUSE_MODEL_BASE64=${JSON.stringify(base64)};</script><script type="module">${source.replace(/<\/script/gi, '<\\/script')}</script>`);
for (const match of [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)]) {
  const css = await fs.readFile(`dist/${match[1].replace(/^\//, '')}`, 'utf8');
  html = html.replace(match[0], () => `<style>${css}</style>`);
}
if (/<script[^>]+src=|<link[^>]+rel="stylesheet"/.test(html)) throw Error('External build assets remain');
await fs.mkdir('artifacts', { recursive: true });
await fs.writeFile('artifacts/cloud-house-preview.html', html);
console.log('Standalone preview: artifacts/cloud-house-preview.html (JS, CSS and GLB embedded)');
