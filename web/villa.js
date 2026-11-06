import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Water } from 'three/addons/objects/Water.js';

export function createVilla(renderer,mobile){
 const root=new T.Group(),layers=Array.from({length:5},()=>new T.Group());layers.forEach(l=>root.add(l));
 let seed=29;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
 function texture(type){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=type==='wood'?'#795233':'#b7ac91';x.fillRect(0,0,256,256);for(let i=0;i<2500;i++){let a=rand();x.strokeStyle=type==='wood'?`rgba(${a>.5?'34,21,11':'192,151,96'},${rand()*.21})`:`rgba(${a>.5?'53,47,34':'241,229,200'},${rand()*.11})`;x.lineWidth=rand()*1.3;x.beginPath();const y=rand()*256;x.moveTo(rand()*256,y);x.lineTo(rand()*256,y+rand()*(type==='wood'?2:8));x.stroke();}const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(type==='wood'?2:1,2);map.anisotropy=4;return map;}
 const stone=new T.MeshStandardMaterial({color:'#c1b69a',map:texture('stone'),roughness:.78}),wood=new T.MeshStandardMaterial({color:'#b39466',map:texture('wood'),roughness:.66}),dark=new T.MeshStandardMaterial({color:'#272b25',roughness:.5,metalness:.35}),glass=new T.MeshPhysicalMaterial({color:'#8ea6a0',metalness:.1,roughness:.07,transparent:true,opacity:.20,depthWrite:false,side:T.DoubleSide}),linen=new T.MeshStandardMaterial({color:'#d4cbb4',roughness:.95}),soil=new T.MeshStandardMaterial({color:'#262d22',roughness:1}),leaf=new T.MeshStandardMaterial({color:'#526046',roughness:1}),warm=new T.MeshStandardMaterial({color:'#e9b66a',emissive:'#ffa846',emissiveIntensity:2.5,roughness:.4}),rug=new T.MeshStandardMaterial({color:'#8b8a72',roughness:1});
 const batches=layers.map(()=>new Map());function add(layer,mat,g,pos=[0,0,0],rotation=0){if(g.index)g=g.toNonIndexed();g.rotateY(rotation);g.translate(...pos);if(!batches[layer].has(mat))batches[layer].set(mat,[]);batches[layer].get(mat).push(g);}
 const box=(l,m,p,s,r=0)=>add(l,m,new T.BoxGeometry(...s),p,r);
 const cylinder=(l,m,p,rt,rb,h)=>add(l,m,new T.CylinderGeometry(rt,rb,h,8),p);
 // Ground and reflecting pool, with stepping stones and restrained planting.
 box(0,dark,[0,-.44,1],[23,.5,19]);box(0,stone,[0,-.16,0],[21,.2,16]);
 box(0,wood,[-7.9,.015,2.9],[3.5,.16,11]);box(0,dark,[3,-.05,6.6],[10.8,.25,4.2]);
 for(const x of [-2.6,8.6])box(0,stone,[x,.12,6.6],[.28,.35,4.55]);for(const z of[4.35,8.85])box(0,stone,[3,.12,z],[11.5,.35,.28]);
 for(let i=0;i<8;i++)box(0,stone,[-8.2,.12,-3+i*1.15],[1.7,.12,.72]);
 for(const[x,z]of [[-9,-5],[8,-5],[-8,7.3],[8.5,1.7]]){box(0,dark,[x,.18,z],[1.7,.55,1.7]);cylinder(0,wood,[x,1.5,z],.07,.12,2.5);for(let j=0;j<5;j++){const geo=new T.IcosahedronGeometry(.8,1);geo.scale(1,.7,.8);add(0,leaf,geo,[x+Math.sin(j*2)*.5,2.7+j*.17,z+Math.cos(j*2)*.45]);}}
 for(let i=0;i<14;i++)box(0,leaf,[-2.4+i*.75,.2,-6.7],[.55,.55,.8]);
 for(const x of[-5.5,-3.2]){box(0,wood,[x,.22,6.9],[1.65,.18,3]);box(0,linen,[x,.42,6.5],[1.45,.22,2]);box(0,linen,[x,.65,5.5],[1.45,.25,.75],0);}
 // Ground level: open-plan structure with visible furnishings.
 box(1,stone,[0,.2,0],[14.8,.35,9.4]);box(1,wood,[0,.4,0],[13.9,.08,8.8]);
 box(1,stone,[0,1.9,-4.35],[14.6,3.05,.28]);box(1,stone,[7,1.9,-1.4],[.32,3.05,5.9]);
 for(const x of[-7,-2,2.7,7])box(1,dark,[x,1.9,4.25],[.12,3.05,.12]);
 box(1,glass,[.3,1.9,4.26],[13.1,2.9,.03]);box(1,glass,[-7.05,1.9,0],[.03,2.9,8.4]);
 for(const x of[-7,-3.5,0,3.5,7])box(1,dark,[x,1.9,4.27],[.035,3.05,.05]);
 for(const y of[.48,3.38])box(1,dark,[0,y,4.3],[14.2,.055,.08]);
 for(let i=0;i<20;i++)box(1,wood,[-6.9+i*.17,1.88,-4.1],[.08,2.8,.19]);
 box(1,rug,[-3,.47,1.0],[5.1,.035,3.9]);
 box(1,linen,[-4.1,.75,.15],[3.7,.55,1.3]);box(1,linen,[-4.1,1.08,-.42],[3.7,.7,.25]);box(1,linen,[-5.85,1.02,.13],[.3,.65,1.4]);
 box(1,linen,[-5.3,.74,1.7],[1.25,.52,2]);box(1,wood,[-2.7,.7,1.5],[1.8,.17,1.2]);
 for(const x of[-3.25,-2.1])for(const z of[1.15,1.85])box(1,dark,[x,.55,z],[.06,.32,.06]);
 box(1,dark,[-3.5,1.45,-3.85],[3.2,1.2,.12]);box(1,wood,[-3.5,.65,-3.65],[4,.5,.6]);
 // Kitchen island and cabinetry.
 box(1,wood,[4.9,.91,-2.9],[3.9,1,.9]);box(1,stone,[4.9,1.47,-2.9],[4.1,.12,1.1]);
 box(1,stone,[4.1,.92,.0],[3.7,.95,1.35]);box(1,stone,[4.1,1.46,.0],[4,.13,1.55]);box(1,dark,[4.8,1.54,.0],[.7,.03,.7]);
 for(const x of[2.8,4,5.2]){cylinder(1,wood,[x,.76,1.65],.28,.28,.13);box(1,dark,[x,.55,1.65],[.06,.42,.06]);}
 // Dining table and six sculptural chairs.
 box(1,wood,[.7,1.1,-2.1],[2.3,.12,1.55]);for(const x of[-.2,1.6])for(const z of[-2.65,-1.55])box(1,dark,[x,.77,z],[.07,.65,.07]);
 for(const x of[-.1,.75,1.6])for(const z of[-3.2,-1]){box(1,linen,[x,.78,z],[.55,.12,.55]);box(1,wood,[x,.58,z],[.08,.4,.08]);box(1,wood,[x,1.05,z+(z<-2?-.23:.23)],[.55,.55,.07]);}
 for(const x of[2.6,4.1,5.6]){cylinder(1,dark,[x,2.9,.1],.01,.01,.85);cylinder(1,warm,[x,2.42,.1],.16,.3,.19);}
 box(1,warm,[0,3.38,-4.03],[13.2,.025,.04]);
 // A separate middle ceiling/terrace slab.
 box(2,stone,[0,3.65,0],[15.6,.38,10]);box(2,dark,[0,3.47,0],[15.65,.055,10.05]);box(2,warm,[0,3.44,4.75],[13.7,.035,.045]);box(2,wood,[0,3.88,0],[14.2,.06,8.8]);
 // Upper private realm: three bedrooms and a continuous glass terrace.
 box(3,stone,[0,5.35,-4.05],[13.4,2.8,.25]);box(3,wood,[1.4,5.35,-1],[.18,2.8,6.2]);box(3,wood,[-3.2,5.35,-1.1],[.18,2.8,6.1]);box(3,stone,[6.65,5.35,-1],[.25,2.8,6.4]);
 box(3,glass,[0,5.35,3.25],[13.4,2.7,.03]);box(3,glass,[-6.7,5.35,-.5],[.03,2.7,7.1]);
 for(const x of[-6.75,-3.3,0,3.3,6.75])box(3,dark,[x,5.35,3.3],[.04,2.85,.07]);
 for(const y of[3.94,6.75])box(3,dark,[0,y,3.3],[13.55,.06,.07]);
 for(const x of[-5, -.9,4.1]){
  box(3,rug,[x,3.96,-.3],[3.3,.025,4.3]);box(3,wood,[x,4.17,-.8],[2.65,.35,3.25]);box(3,linen,[x,4.43,-.8],[2.55,.3,3.1]);box(3,linen,[x,4.85,-2.27],[2.65,1.1,.17]);box(3,linen,[x-.62,4.65,-1.85],[.95,.16,.6]);box(3,linen,[x+.62,4.65,-1.85],[.95,.16,.6]);box(3,wood,[x,4.62,.25],[2.58,.06,.85]);
  for(const dx of[-1.65,1.65]){box(3,wood,[x+dx,4.25,-1.8],[.5,.6,.6]);cylinder(3,warm,[x+dx,4.75,-1.8],.16,.2,.3);}
 }
 box(3,glass,[0,4.5,4.65],[15,.95,.035]);box(3,dark,[0,5.0,4.65],[15,.04,.045]);for(const x of[-7.5,7.5])box(3,glass,[x,4.5,3.8],[.03,.95,1.7]);
 for(let i=0;i<16;i++)box(3,wood,[5.4+i*.12,5.35,3.4],[.05,2.75,.1]);
 // Slender flat roof and a layered teak pergola.
 box(4,stone,[0,7.02,-.2],[15.3,.28,9.6]);box(4,dark,[0,7.19,-.2],[15.5,.065,9.8]);box(4,wood,[0,6.84,-.2],[14.7,.08,9]);
 box(4,warm,[0,6.79,4.15],[13.9,.035,.035]);
 for(let i=0;i<31;i++)box(4,wood,[-7.1+i*.47,7.4,3],[.13,.25,3.7]);
 for(const z of[1.35,4.6])box(4,dark,[0,7.35,z],[14.8,.15,.1]);
 for(let l=0;l<5;l++)for(const[mat,geos]of batches[l]){const mesh=new T.Mesh(mergeGeometries(geos,false),mat);mesh.castShadow=mat!==glass;mesh.receiveShadow=true;layers[l].add(mesh);geos.forEach(g=>g.dispose());}
 // Real planar reflection with continuously animated wave normals.
 const normalCanvas=document.createElement('canvas');normalCanvas.width=normalCanvas.height=128;const ctx=normalCanvas.getContext('2d'),pixels=ctx.createImageData(128,128);for(let y=0;y<128;y++)for(let x=0;x<128;x++){let i=(y*128+x)*4;pixels.data[i]=128+Math.sin(x*.36+y*.14)*30;pixels.data[i+1]=128+Math.cos(y*.29+x*.12)*30;pixels.data[i+2]=245;pixels.data[i+3]=255;}ctx.putImageData(pixels,0,0);const normals=new T.CanvasTexture(normalCanvas);normals.wrapS=normals.wrapT=T.RepeatWrapping;
 const water=new Water(new T.PlaneGeometry(10.65,4.18),{textureWidth:mobile?256:512,textureHeight:mobile?256:512,waterNormals:normals,sunDirection:new T.Vector3(-1,.7,-.5).normalize(),sunColor:0xffc887,waterColor:0x214b43,distortionScale:1.15,fog:false});water.rotation.x=-Math.PI/2;water.position.set(3,.11,6.6);layers[0].add(water);
 // Warm architectural glow; avoid dozens of shadow-casting lights.
 const glow=new T.PointLight(0xffbd74,55,12,2);glow.position.set(-2,2,1);layers[1].add(glow);const upperGlow=new T.PointLight(0xffc585,30,10,2);upperGlow.position.set(2,5,0);layers[3].add(upperGlow);
 const plinth=new T.Mesh(new T.CylinderGeometry(16.8,17,.12,96),new T.MeshStandardMaterial({color:'#181f19',roughness:.6,metalness:.15}));plinth.position.y=-.78;root.add(plinth);
 return {root,layers,water};
}

export function twilightEnvironment(renderer){
 const w=512,h=256,data=new Float32Array(w*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const v=y/h,u=x/w;const horizon=Math.exp(-Math.pow((v-.5)*9,2)),sun=Math.exp(-Math.pow((u-.68)*70,2)-Math.pow((v-.49)*90,2));let i=(y*w+x)*4;data[i]=.08+horizon*.9+sun*7;data[i+1]=.105+horizon*.5+sun*4;data[i+2]=.12+horizon*.25+sun*2;data[i+3]=1;}
 const t=new T.DataTexture(data,w,h,T.RGBAFormat,T.FloatType);t.mapping=T.EquirectangularReflectionMapping;t.needsUpdate=true;const pmrem=new T.PMREMGenerator(renderer),env=pmrem.fromEquirectangular(t);t.dispose();pmrem.dispose();return env.texture;
}
