import fs from 'node:fs/promises';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const file = await fs.readFile('public/models/test-scene.glb');
if (file.toString('ascii', 0, 4) !== 'glTF' || file.readUInt32LE(4) !== 2 || file.readUInt32LE(8) !== file.length) throw Error('Invalid GLB header');
const model = await new GLTFLoader().parseAsync(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength), '');
const meshes = [];
model.scene.traverse(object => { if (object.isMesh) meshes.push(object); });
for (const name of ['MCP_TEST', 'TEST_FLOOR']) if (!meshes.some(mesh => mesh.name === name)) throw Error(`Missing mesh: ${name}`);
for (const mesh of meshes) {
  const positions = mesh.geometry.attributes.position;
  if (!positions?.count || !positions.array.every(Number.isFinite)) throw Error(`Invalid geometry: ${mesh.name}`);
}
console.log(`[PASS] Three.js GLTFLoader parsed ${meshes.length} meshes from Blender export (${file.length} bytes)`);
