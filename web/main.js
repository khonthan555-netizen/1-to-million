import * as T from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import {createVilla,twilightEnvironment} from './villa.js';
import './style.css';
gsap.registerPlugin(ScrollTrigger);
const holder=document.querySelector('#scene'),mobile=matchMedia('(max-width:600px)').matches,preference=matchMedia('(prefers-reduced-motion:reduce)');
let reduced=preference.matches,paused=false,cinematic=!mobile&&!reduced&&new URLSearchParams(location.search).get('quality')!=='performance',progress=0,shownProgress=0,active=0,ambient=0;
let renderer,composer,bokeh,scene,camera,villa,lenis;
const clamp=T.MathUtils.clamp,smooth=(a,b,v)=>T.MathUtils.smoothstep(v,a,b);
const levels=['residence','roof','suite','slab','living','landscape','complete'];
const keys=[
 {p:0,c:[21,12.5,23],t:[0,2.4,1]},
 {p:.16,c:[17,23,21],t:[0,18.1,0]},
 {p:.33,c:[16,16.2,20],t:[0,13.3,.5]},
 {p:.50,c:[17,13.2,20],t:[0,9.2,.5]},
 {p:.67,c:[16,9.0,20],t:[0,5,0]},
 {p:.84,c:[19,12.8,24],t:[0,0,2]},
 {p:1,c:[21,12.5,23],t:[0,2.4,1]}
];
function select(index){active=index;document.body.dataset.level=index;document.querySelectorAll('[data-nav]').forEach((a,i)=>a.setAttribute('aria-current',String(i===index)));}
function updateReduced(){reduced=preference.matches;document.body.classList.toggle('reduced',reduced);document.querySelector('#motion-label').textContent=reduced?'REDUCED MOTION · STATIC MODEL':'LIVE ARCHITECTURE';if(reduced){cinematic=false;lenis?.destroy();lenis=null;}updateButtons();}
function updateButtons(){document.querySelector('#motion').textContent=paused?'>':'II';document.querySelector('#motion').setAttribute('aria-pressed',String(paused));document.querySelector('#motion').setAttribute('aria-label',paused?'Resume ambient motion':'Pause ambient motion');document.querySelector('#quality').innerHTML=(cinematic?'Cinematic':'Performance')+' <span aria-hidden="true" class="quality-star"></span>';document.querySelector('#quality').setAttribute('aria-pressed',String(cinematic));}
try{
 renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.25:1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;holder.append(renderer.domElement);
 scene=new T.Scene();scene.background=new T.Color('#131715');scene.environment=twilightEnvironment(renderer);scene.environmentIntensity=.6;
 camera=new T.PerspectiveCamera(mobile?48:38,1,.1,200);
 villa=createVilla(renderer,mobile);scene.add(villa.root);
 scene.add(new T.HemisphereLight(0xadbcb4,0x141d15,1.6));const sun=new T.DirectionalLight(0xffd1a1,3.8);sun.position.set(-12,20,12);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-22,right:22,top:25,bottom:-20,near:1,far:70});sun.shadow.bias=-.0007;sun.shadow.normalBias=.04;scene.add(sun);
 const rim=new T.DirectionalLight(0x8db3bc,1.4);rim.position.set(12,15,-10);scene.add(rim);
 composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));bokeh=new BokehPass(scene,camera,{focus:30,aperture:.00007,maxblur:.004});composer.addPass(bokeh);composer.addPass(new OutputPass());
 function resize(){const w=holder.clientWidth,h=holder.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);composer.setSize(w,h);}
 new ResizeObserver(resize).observe(holder);resize();
 if(!reduced){lenis=new Lenis({duration:1.2,smoothWheel:true,syncTouch:false});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(time=>lenis?.raf(time*1000));gsap.ticker.lagSmoothing(0);}
 ScrollTrigger.create({trigger:'main',start:'top top',end:'bottom bottom',onUpdate:self=>{progress=self.progress;}});
 document.querySelectorAll('main [data-level]').forEach((section,i)=>{if(i>0&&!reduced)gsap.fromTo(section.querySelector('.section-copy'),{autoAlpha:0,y:26},{autoAlpha:1,y:0,duration:.9,ease:'power2.out',scrollTrigger:{trigger:section,start:'top 70%',toggleActions:'play reverse play reverse'}});});
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',event=>{const el=document.querySelector(a.getAttribute('href'));if(!el)return;event.preventDefault();if(lenis)lenis.scrollTo(el,{duration:1.8});else el.scrollIntoView({behavior:reduced?'instant':'smooth'});}));
 document.querySelector('#motion').onclick=()=>{paused=!paused;updateButtons();};
 document.querySelector('#quality').onclick=()=>{cinematic=!cinematic&&!reduced;renderer.setPixelRatio(cinematic?Math.min(devicePixelRatio,1.5):1);resize();updateButtons();};
 preference.addEventListener('change',updateReduced);updateReduced();select(0);
 const target=new T.Vector3(),position=new T.Vector3();let last=performance.now(),frames=0,elapsed=0,adaptive=false;
 function tick(now){const realDt=Math.max(0,(now-last)/1000),dt=Math.min(realDt,.1);last=now;if(!paused&&!reduced)ambient+=dt;shownProgress=reduced?progress:T.MathUtils.damp(shownProgress,progress,6,dt);const p=shownProgress;const focusY=window.scrollY+innerHeight*.55;let visible=0;document.querySelectorAll('main [data-level]').forEach((s,i)=>{if(s.offsetTop<=focusY)visible=i;});if(visible!==active)select(visible);
  const explode=reduced?0:smooth(.025,.125,p)*(1-smooth(.88,.985,p));const offsets=[0,3.2,6.4,9.5,12.2];const settle=p>.978&&!reduced?Math.sin((p-.978)/.022*Math.PI*2)*Math.exp(-(p-.978)/.022*7)*.12:0;villa.layers.forEach((layer,i)=>layer.position.y=offsets[i]*explode+settle*i);
  let k=0;while(k<keys.length-2&&p>keys[k+1].p)k++;const a=keys[k],b=keys[k+1],u=smooth(.2,.8,(p-a.p)/(b.p-a.p));
  position.fromArray(a.c).lerp(new T.Vector3(...b.c),u);target.fromArray(a.t).lerp(new T.Vector3(...b.t),u);
  if(reduced){position.fromArray(keys[0].c);target.fromArray(keys[0].t);}
  if(mobile){position.x=position.x*.55;position.z=position.z*1.7;target.y+=reduced?0:.8;}
  const orbit=(!reduced?Math.sin(ambient*.13)*.055:0)*(p<.04||p>.97?1:.15);position.applyAxisAngle(T.Object3D.DEFAULT_UP,orbit);camera.position.copy(position);camera.lookAt(target);
  villa.water.material.uniforms.time.value=ambient*.45;
  bokeh.uniforms.focus.value=camera.position.distanceTo(target);bokeh.enabled=cinematic&&!reduced;
  if(cinematic&&!reduced)composer.render();else renderer.render(scene,camera);
  frames++;elapsed+=realDt;if(elapsed>2.5&&!adaptive){const fps=frames/elapsed;if(fps<42&&cinematic){cinematic=false;renderer.setPixelRatio(1);resize();updateButtons();}adaptive=true;document.body.dataset.measuredFps=Math.round(fps);}
  window.__villaState={waterTime:ambient,progress:p,level:active,explosion:explode,layers:villa.layers.map(l=>l.position.y),reduced,paused,cinematic,drawCalls:renderer.info.render.calls};
 }
 renderer.setAnimationLoop(tick);document.body.classList.add('ready');document.body.dataset.state='ready';
 window.addEventListener('pagehide',()=>{renderer.setAnimationLoop(null);lenis?.destroy();});
}catch(error){console.error(error);document.body.classList.add('ready');document.body.dataset.state='error';const el=document.querySelector('#error');el.hidden=false;el.textContent+=' ('+error.message+')';}
