import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
const browser=await puppeteer.launch({executablePath:process.env.BROWSER_BIN||'/usr/bin/chromium',headless:true});
const url=process.env.PREVIEW_URL||'http://localhost:5173';
await fs.mkdir('artifacts',{recursive:true});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewport({width:1280,height:900,deviceScaleFactor:1});await page.goto(url+'?quality=performance',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__villaState&&document.body.dataset.state==='ready',{timeout:60000});
 await new Promise(r=>setTimeout(r,1000));await page.screenshot({path:'artifacts/villa-desktop.png'});
 for(const [id,level]of [['roof',1],['suite',2],['slab',3],['living',4],['landscape',5],['complete',6]]){
  await page.click('a[data-nav="'+level+'"]');
  await page.waitForFunction(l=>window.__villaState?.level===l,{timeout:60000},level);await new Promise(r=>setTimeout(r,1000));
  if(id==='complete'){await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await new Promise(r=>setTimeout(r,1800));}const state=await page.evaluate(()=>window.__villaState);console.log(id,JSON.stringify(state));
  if(id==='suite'&&state.explosion<.9)throw Error('Villa did not separate');
  if(id==='complete'&&state.explosion>.05)throw Error('Villa did not reassemble');
  if(['suite','landscape','complete'].includes(id))await page.screenshot({path:`artifacts/villa-${id}.png`});
 }
 await page.click('#motion');const a=await page.evaluate(()=>window.__villaState.waterTime);await new Promise(r=>setTimeout(r,500));const b=await page.evaluate(()=>window.__villaState.waterTime);if(a!==b)throw Error('Ambient motion pause failed');
 await page.click('#quality');console.log('PASS desktop layers, reassembly, motion and quality controls');await page.close();
 const mobile=await browser.newPage();await mobile.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});await mobile.goto(url,{waitUntil:'domcontentloaded'});await mobile.waitForFunction(()=>window.__villaState);await new Promise(r=>setTimeout(r,1000));await mobile.screenshot({path:'artifacts/villa-mobile.png'});if(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Mobile horizontal overflow');console.log('PASS mobile layout');await mobile.close();
 const reduced=await browser.newPage();await reduced.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await reduced.goto(url,{waitUntil:'domcontentloaded'});await reduced.waitForFunction(()=>window.__villaState);await reduced.evaluate(()=>scrollTo(0,document.getElementById('suite').offsetTop));await new Promise(r=>setTimeout(r,500));const state=await reduced.evaluate(()=>window.__villaState);if(!state.reduced||state.explosion!==0||state.waterTime!==0||state.cinematic)throw Error('Reduced motion fallback failed');console.log('PASS reduced-motion static fallback');
 if(errors.length)throw Error(errors.join('\n'));console.log('PASS no page exceptions');
}finally{await browser.close();}
