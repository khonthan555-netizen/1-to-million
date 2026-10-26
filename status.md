# สถานะ Cloud House Pipeline

อัปเดต: 27 ตุลาคม 2026 (Asia/Bangkok)
Repo: khonthan555-netizen/1-to-million

## ขอบเขต
ผู้ใช้ต้องการสั่งสร้างบ้านผ่านโทรศัพท์ด้วย agent + cloud + GitHub
4Argon วางแผน; agent ผลิตและทดสอบ
รอบนี้เตรียม environment และ fixture โมเดลพื้น/ลูกบาศก์ บ้านจริงรอสเปกจาก 4Argon
เส้นทางหลักใช้ Blender Python แบบ background แล้วส่งออก GLB ให้ Three.js

## เพิ่มแล้ว
- Three.js 0.186.1 และ Vite 8.3.5 พร้อม package-lock.json
- คำสั่ง check/model/verify/build/pipeline
- ฉากทดสอบพร้อม .blend และ GLB
- หน้า orbit preview ที่รองรับเมาส์และสัมผัส
- Devcontainer สำหรับ Codespaces และ GitHub Actions workflow
- reference-video.md สกัดข้อกำหนดจาก transcript ของผู้ใช้

## ผลตรวจใน cloud ปัจจุบัน
- แก้กรณี root index.html เปิดเป็น source แล้วค้าง: เพิ่มข้อความแนะนำและลิงก์พรีวิว
- เพิ่ม standalone HTML รวม JS, CSS และ GLB
- npm run qa ผ่าน WebGL และการโหลด GLB ใน desktop, mobile viewport และ standalone
- ยังไม่ได้ทดสอบโทรศัพท์จริง; mobile QA เป็น viewport จำลอง
- Site project_id: appgprj_6adf94e77d708191b59442c25ea9c7d2
- Site preview: https://cloud-house-pipeline-preview.mauvepike65.chatgpt.site
- เผยแพร่ Site ส่วนตัวสำเร็จ version appgprj_6adf94e77d708191b59442c25ea9c7d2~appgver_256c6877b1f48191966194d938f6ddd4
- GitHub runner รอบแรกพบ NumPy ขาดใน Blender Python; เพิ่ม python3-numpy ใน CI/devcontainer และตรวจ dependency ก่อนสร้างฉากแล้ว
- GitHub Actions หลังแก้ผ่านทุกขั้น: run 40374703891, job 121754472960, code commit 72a88e1d9ab31fddf3a7c89718edfa1d5cf57a0a (pipeline, standalone และ upload artifact สำเร็จ)
- npm install ผ่าน
- npm run pipeline ผ่านทั้ง check, model, verify และ build
- Blender 4.3.2 สร้าง .blend และ GLB 3,580 bytes สำเร็จ
- Three.js GLTFLoader อ่าน GLB และตรวจ mesh MCP_TEST กับ TEST_FLOOR ผ่าน
- Build เว็บสำเร็จ; มีคำเตือนขนาด JavaScript bundle เกิน 500 kB
- Draco compression ไม่พร้อม จึงใช้ GLB ไม่บีบอัด

## ยังไม่ได้ยืนยัน
- เปิด Codespaces ใหม่หรือ build Docker image
- การสัมผัสบนโทรศัพท์จริง (WebGL บน desktop/mobile viewport จำลองผ่านแล้ว)
- บ้านสองชั้น, WASD/joystick, collision, บันได, ประตู และกลางวัน/กลางคืน

## งานถัดไป
1. รักษาผล CI บน PR #1 เมื่อเพิ่มโค้ดขั้นถัดไป
2. รับสเปกบ้านจาก 4Argon
3. เพิ่มบ้านและระบบเดิน พร้อมทดสอบทางเข้า บันได ประตู และมือถือ
4. อัปเดต Site preview ให้ตรงกับโมเดลใหม่

โปรแกรมที่มีใน cloud ปัจจุบันไม่ได้เก็บเป็น binary ใน Repo; devcontainer/CI เป็นนิยามการติดตั้งซ้ำ
ผล fixture ยังไม่ใช่โมเดลบ้านสำหรับลูกค้า
