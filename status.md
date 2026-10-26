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
- npm install ผ่าน
- npm run pipeline ผ่านทั้ง check, model, verify และ build
- Blender 4.3.2 สร้าง .blend และ GLB 3,580 bytes สำเร็จ
- Three.js GLTFLoader อ่าน GLB และตรวจ mesh MCP_TEST กับ TEST_FLOOR ผ่าน
- Build เว็บสำเร็จ; มีคำเตือนขนาด JavaScript bundle เกิน 500 kB
- Draco compression ไม่พร้อม จึงใช้ GLB ไม่บีบอัด

## ยังไม่ได้ยืนยัน
- เปิด Codespaces ใหม่หรือ build Docker image
- GitHub Actions run บน runner จริง
- WebGL และการสัมผัสในเบราว์เซอร์/โทรศัพท์จริง
- บ้านสองชั้น, WASD/joystick, collision, บันได, ประตู และกลางวัน/กลางคืน
- URL เว็บถาวร

## งานถัดไป
1. ส่ง branch/PR แล้วตรวจ CI บน GitHub
2. รับสเปกบ้านจาก 4Argon
3. เพิ่มบ้านและระบบเดิน พร้อมทดสอบทางเข้า บันได ประตู และมือถือ
4. จัดทำลิงก์ preview สำหรับตรวจผลงาน

โปรแกรมที่มีใน cloud ปัจจุบันไม่ได้เก็บเป็น binary ใน Repo; devcontainer/CI เป็นนิยามการติดตั้งซ้ำ
ผล fixture ยังไม่ใช่โมเดลบ้านสำหรับลูกค้า
