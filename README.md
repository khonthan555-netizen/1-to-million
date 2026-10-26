# Cloud House Pipeline

## เปิดพรีวิว

ลิงก์ส่วนตัว: https://cloud-house-pipeline-preview.mauvepike65.chatgpt.site
ใช้บัญชีเจ้าของ Site เพื่อเปิดดู ฉากปัจจุบันเป็นพื้นและลูกบาศก์สำหรับตรวจ pipeline

index.html ที่ root เป็น source ของ Vite การเปิดเป็นไฟล์ดิบในแผงไฟล์อาจไม่โหลด JS/CSS
ให้ใช้ลิงก์พรีวิว, dev server หรือ build output
สร้างไฟล์ preview ที่รวม JS/CSS/GLB ทั้งหมดด้วย npm run build แล้ว npm run standalone
ผลอยู่ artifacts/cloud-house-preview.html โดยไม่ต้องโหลด dependencies จากภายนอกระหว่างเปิด
การวาด 3D ยังต้องอาศัย WebGL และการอนุญาต JavaScript ของตัวแสดง HTML ที่ใช้
ถ้าแผงไฟล์จำกัดสคริปต์ ให้เปิดลิงก์พรีวิวในเบราว์เซอร์

ตรวจ WebGL/GLB และ responsive layout ด้วย npm run qa เมื่อมี Chromium ใน PATH
หรือกำหนด BROWSER_BIN เป็นพาธ Chrome/Chromium ที่ต้องการ
การตรวจนี้ใช้ desktop และ mobile viewport จำลอง ไม่แทนการทดสอบโทรศัพท์จริง

ฐานระบบสร้างโมเดลด้วย Blender บนคลาวด์ แล้วส่งออก GLB ให้ Three.js
4Argon วางแผน → agent ผลิตและทดสอบ → GitHub เก็บงาน → เว็บเปิดดูผล

รอบนี้เป็น fixture พื้นกับลูกบาศก์สำหรับตรวจระบบ บ้านและระบบเดินชมจะเพิ่มตามสเปกถัดไป

## ทำงานจากโทรศัพท์

ใช้ agent ที่เชื่อม Repo นี้และมี cloud executor หรือเปิด GitHub Codespaces
Repo เก็บโค้ดและสถานะ; โปรแกรมทำงานบน executor ไม่ได้รันอยู่ใน GitHub ตลอดเวลา

### GitHub Codespaces

เปิด branch ที่มีชุดระบบนี้ → Code → Codespaces → Create codespace
Devcontainer ติดตั้ง Blender, Python, FFmpeg, Chromium และ Node จากนั้นรัน pipeline
หลัง setup เสร็จ รัน npm run dev และเปิด forwarded port 5173
โควต้าและการใช้งาน Codespaces/Actions ขึ้นกับบัญชี GitHub

### Cloud ที่มีเครื่องมือแล้ว

ต้องมี Node >=22.12, npm, Blender พร้อม glTF exporter, Python 3, FFmpeg และ Git

```sh
npm ci
npm run pipeline
npm run dev
```

pipeline ตรวจโปรแกรม → สร้างและบันทึกฉาก → ส่งออก GLB → ใช้ Three.js GLTFLoader ตรวจ geometry → build เว็บ
ตั้ง BLENDER_BIN หาก Blender ไม่อยู่ใน PATH
เวอร์ชัน Blender ใน distro อาจต่างจากคลาวด์ปัจจุบัน ต้องให้ pipeline ผ่านในแต่ละ environment

## ไฟล์และผลลัพธ์

- scene/build_test_scene.py: ฉากทดสอบ ขนาดเป็นเมตร
- scripts/: ตรวจ environment สร้างและตรวจ GLB
- web/: หน้า orbit preview หมุนและซูมด้วยเมาส์/สัมผัส
- .devcontainer/: environment สำหรับ Codespaces
- .github/workflows/pipeline.yml: ตรวจ push/PR และสั่งรันด้วย workflow_dispatch
- status.md: สถานะล่าสุด
- reference-video.md: ข้อกำหนดที่สกัดจาก transcript ของผู้ใช้

ผลลัพธ์: artifacts/test-scene.blend, public/models/test-scene.glb, dist/
ไฟล์ที่สร้างซ้ำได้ไม่ commit; Actions เก็บเว็บและ .blend ใน artifact ชื่อ cloud-3d-preview
Artifact เป็นไฟล์ดาวน์โหลด การเผยแพร่ URL เว็บถาวรยังเป็นงานขั้นถัดไป
หน้า fixture ยังไม่มี WASD, collision, บันได หรือประตู

## แผนจาก 4Argon

ระบุขนาดที่ดิน ขนาดอาคาร ความสูงชั้น ผังห้อง ช่องเปิด บันได วัสดุ ภาพอ้างอิง และเกณฑ์ตรวจรับ
ให้ agent อ่าน status.md ก่อนทำงานและบันทึกผลทดสอบจริงหลังแก้
ภาพอ้างอิงใช้กำหนดรูปลักษณ์ ส่วนมิติอาคารต้องอ้างจากสเปกหรือแบบที่ยืนยันแล้ว
