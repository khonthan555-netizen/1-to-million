"""Pipeline fixture, not an architectural design. Units are metres."""
from pathlib import Path
import bpy

root = Path(__file__).resolve().parents[1]
models = root / 'public' / 'models'
artifacts = root / 'artifacts'
models.mkdir(parents=True, exist_ok=True)
artifacts.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.context.scene.unit_settings.system = 'METRIC'


def box(name, location, dimensions, color):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    material = bpy.data.materials.new(name + '_material')
    material.diffuse_color = (*color, 1)
    material.use_nodes = True
    material.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value = (*color, 1)
    obj.data.materials.append(material)
    return obj


box('TEST_FLOOR', (0, 0, -0.1), (8, 8, 0.2), (0.22, 0.29, 0.28))
box('MCP_TEST', (0, 0, 1), (2, 2, 2), (0.85, 0.46, 0.17))
bpy.ops.wm.save_as_mainfile(filepath=str(artifacts / 'test-scene.blend'))
bpy.ops.export_scene.gltf(filepath=str(models / 'test-scene.glb'), export_format='GLB')
print('PIPELINE_MODEL_READY', models / 'test-scene.glb')
