import { execFileSync } from 'node:child_process';
const [major, minor] = process.versions.node.split('.').map(Number);
let failed = major < 22 || major === 22 && minor < 12;
console.log(`[${failed ? 'FAIL' : 'PASS'}] Node.js ${process.version}`);
for (const [name, command, args] of [
  ['Blender', process.env.BLENDER_BIN || 'blender', ['--version']],
  ['Python', 'python3', ['--version']], ['FFmpeg', 'ffmpeg', ['-version']], ['Git', 'git', ['--version']],
]) {
  try { console.log(`[PASS] ${name}: ${execFileSync(command, args, { encoding: 'utf8', timeout: 30000 }).split('\n')[0]}`); }
  catch (error) { failed = true; console.error(`[FAIL] ${name}: ${error.message}`); }
}
try {
  execFileSync(process.env.BLENDER_BIN || 'blender', ['--background', '--factory-startup', '--python-exit-code', '1', '--python-expr', "import bpy, numpy; bpy.ops.export_scene.gltf.get_rna_type(); print('Blender Python dependencies ready')"], { timeout: 60000, encoding: 'utf8' });
  console.log('[PASS] Blender Python: NumPy and glTF exporter available');
} catch (error) { failed = true; console.error(`[FAIL] Blender Python dependencies: ${error.message}`); }
process.exitCode = failed ? 1 : 0;
