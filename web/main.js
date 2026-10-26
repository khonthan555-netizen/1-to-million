import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './style.css';
const viewport = document.querySelector('#viewport'), status = document.querySelector('#status');
window.cloudHouseBooted = true;
try {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  viewport.append(renderer.domElement);
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#dce7e0');
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100); camera.position.set(8, 6, 8);
  const controls = new OrbitControls(camera, renderer.domElement); controls.target.set(0, 0.7, 0); controls.enableDamping = true;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x667366, 3));
  const light = new THREE.DirectionalLight(0xffffff, 3); light.position.set(4, 8, 3); scene.add(light);
  const resize = () => { const w = viewport.clientWidth, h = viewport.clientHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); };
  new ResizeObserver(resize).observe(viewport); resize();
  const loaded = model => { scene.add(model.scene); status.textContent = 'โหลด GLB จาก Blender สำเร็จ'; document.body.dataset.state = 'ready'; };
  const failed = error => { console.error(error); status.textContent = 'โหลดโมเดลไม่สำเร็จ กรุณาเปิดพรีวิวผ่านเว็บไซต์'; document.body.dataset.state = 'model-error'; };
  const loader = new GLTFLoader();
  if (window.CLOUD_HOUSE_MODEL_BASE64) {
    const bytes = Uint8Array.from(atob(window.CLOUD_HOUSE_MODEL_BASE64), char => char.charCodeAt(0));
    loader.parseAsync(bytes.buffer, '').then(loaded, failed);
  } else loader.load(`${import.meta.env.BASE_URL}models/test-scene.glb`, loaded, undefined, failed);
  renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
} catch (error) { status.textContent = `เปิดฉากไม่ได้: ${error.message} กรุณาลองเปิดพรีวิวผ่านเว็บไซต์`; document.body.dataset.state = 'renderer-error'; }
