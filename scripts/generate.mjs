import { spawn } from 'node:child_process';
const child = spawn(process.env.BLENDER_BIN || 'blender', ['--background', '--factory-startup', '--python-exit-code', '1', '--python', 'scene/build_test_scene.py'], { stdio: 'inherit' });
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('close', code => { process.exitCode = code === 0 ? 0 : 1; });
