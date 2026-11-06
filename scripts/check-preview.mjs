import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';
const root = process.cwd();
const server = http.createServer(async (req, res) => {
  const name = new URL(req.url, 'http://localhost').pathname;
  let file = name === '/standalone.html' ? path.join(root, 'artifacts/cloud-house-preview.html') : path.join(root, 'dist', name === '/' ? 'index.html' : name);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try {
    const data = await fs.readFile(file);
    const type = file.endsWith('.html') ? 'text/html; charset=utf-8' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'model/gltf-binary';
    res.writeHead(200, { 'Content-Type': type }).end(data);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  const executablePath = process.env.BROWSER_BIN || execFileSync('which', ['chromium'], { encoding: 'utf8' }).trim();
  browser = await puppeteer.launch({ executablePath, headless: true });
  for (const [name, width, height] of [['desktop', 1280, 900], ['mobile', 390, 844], ['standalone', 1000, 800]]) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
    await page.goto(url + (name === 'standalone' ? '/standalone.html' : '/'));
    await page.waitForFunction(() => document.body.dataset.state === 'ready' || document.body.dataset.state?.endsWith('error'), { timeout: 20000 });
    const state = await page.evaluate(() => ({ state: document.body.dataset.state, status: document.querySelector('#status').textContent, canvas: !!document.querySelector('canvas'), overflow: document.documentElement.scrollWidth > innerWidth }));
    if (state.state !== 'ready' || !state.canvas || state.overflow || errors.length) throw Error(`${name}: ${JSON.stringify(state)} ${errors.join('\n')}`);
    await page.screenshot({ path: `artifacts/preview-${name}.png`, fullPage: true });
    console.log(`[PASS] ${name}: WebGL renderer + GLB loaded, layout within viewport`);
    await page.close();
  }
} finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
