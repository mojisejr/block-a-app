เยี่ยมเลยครับ ฟีเจอร์ **"The 'Bonk' Toggle"** (หรือโหมด "กันยางแตก") นี้จะทำให้แอปดูมีความเป็นมนุษย์และเข้าใจนักวิ่งมากครับ

หลักการคือเราจะ **"สลับ Logic การคำนวณ"** และ **"เปลี่ยนบทพูด"** เล็กน้อยครับ จากเดิมที่เน้นจบเร็ว (Negative Split) ให้กลายเป็นเน้นจบชัวร์ (Positive Split/Even Split)

นี่คือวิธีทำทีละขั้นตอนครับ (Simple & Robust):

-----

### 1\. Logic Design (สูตรคำนวณ)

เราจะเพิ่มตัวแปร `isBonkMode` (Boolean) เข้าไปในสูตรครับ

  * **โหมดปกติ (Aggressive):** เก็บแรงตอนต้น -\> อัดตอนจบ (Pace เลขน้อยลง)
  * **โหมดกันตาย (Safe Mode):** วิ่งประคองตอนต้น -\> ยอมให้ช้าลงได้ตอนจบ (Pace เลขมากขึ้น)

**ตารางเปรียบเทียบ Multiplier (ตัวคูณ Pace):**

| Phase | Normal (Negative Split) | Bonk Mode (Survival Plan) |
| :--- | :--- | :--- |
| **Warm Up** | Base x 1.125 (ช้า) | Base x 1.05 (ช้าแค่นิดเดียว พอวอร์ม) |
| **Cruise** | Base x 1.00 (นิ่ง) | Base x 1.00 (นิ่ง) |
| **Kick/Finish**| **Base x 0.925 (เร่ง\!)** | **Base x 1.05 (ผ่อนคลาย/เอาตัวรอด)** |

-----

### 2\. Implementation (Coding)

แยกเป็น 2 ส่วนครับ: **Logic** และ **UI**

#### Step 2.1: แก้ไขไฟล์ `utils/calculator.ts`

เพิ่ม Argument `isBonkMode` เข้าไปในฟังก์ชันคำนวณ

```typescript
// utils/calculator.ts

export function calculateRacePlan(
  distance: number, 
  targetTimeMinutes: number, 
  isBonkMode: boolean // <--- รับค่าตรงนี้เพิ่ม
) {
  
  // 1. หา Base Pace (นาที/กม.)
  // ถ้า Bonk Mode เราไม่ต้อง Compensate เยอะ เพราะเราไม่ได้กะจะเร่งตอนจบ
  const compensateFactor = isBonkMode ? 1.00 : 1.01; 
  const basePace = (targetTimeMinutes / distance) / compensateFactor;

  // 2. กำหนด Multiplier ตามโหมด
  const multipliers = isBonkMode 
    ? { warm: 1.05, cruise: 1.00, kick: 1.05 } // Safe: เริ่มเกือบปกติ จบผ่อน
    : { warm: 1.125, cruise: 1.00, kick: 0.925 }; // Normal: เริ่มช้า จบเร็ว

  // 3. คำนวณ Pace แต่ละช่วง
  const warmPace = basePace * multipliers.warm;
  const cruisePace = basePace * multipliers.cruise;
  const kickPace = basePace * multipliers.kick;

  // ... Return ค่ากลับไป (แปลงเป็น MM:SS string ให้เรียบร้อย)
  return {
    splits: { warmPace, cruisePace, kickPace },
    narrativeMode: isBonkMode ? 'survival' : 'aggressive' // ส่ง Flag กลับไปบอกหน้า UI เพื่อเลือกบทพูด
  };
}
```

#### Step 2.2: หน้า UI (`components/step-result.tsx` หรือที่เกี่ยวข้อง)

ใช้ **Switch** ของ Shadcn UI มาวางไว้ (อาจจะวางคู่กับปุ่ม Calculate หรือวางหน้า Result ก็ได้เพื่อให้กดเปลี่ยนไปมาได้ทันที)

```tsx
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"

// ... inside component
const [isBonkMode, setIsBonkMode] = useState(false);

// ฟังก์ชันเรียกคำนวณใหม่เมื่อ Toggle เปลี่ยน
const handleModeChange = (checked: boolean) => {
    setIsBonkMode(checked);
    // เรียกฟังก์ชันคำนวณใหม่ (Re-calculate) ทันที
    reCalculatePlan(checked); 
};

return (
  <div className="flex items-center space-x-2 my-4 p-4 bg-slate-50 rounded-lg border">
    <Switch 
      id="bonk-mode" 
      checked={isBonkMode}
      onCheckedChange={handleModeChange} 
    />
    <div className="flex flex-col">
      <Label htmlFor="bonk-mode" className="font-bold text-slate-700">
        โหมดกันยางแตก (Survival Mode)
      </Label>
      <span className="text-xs text-slate-500">
        เปิดเมื่อรู้สึกไม่ฟิต หรืออยากวิ่งจบแบบไม่เจ็บ
      </span>
    </div>
  </div>
)
```

-----

### 3\. The Content Strategy (บทพูดต้องเปลี่ยน\!)

ความเจ๋งอยู่ที่ตรงนี้ครับ ถ้า Logic เปลี่ยนแต่ "คำแนะนำ" เหมือนเดิม user จะงง เราต้องเปลี่ยน Text ด้วย

**ตัวอย่าง Code การเลือกข้อความ:**

```tsx
// ส่วนแสดงผล Narrative
const narrativeText = isBonkMode ? {
  // --- บทพูดแบบ Safe Mode ---
  warm: "ช่วงแรก: ออกตัวสบายๆ ไม่ต้องฝืน รักษาแรงไว้",
  cruise: "ช่วงกลาง: ล็อกความเร็วนี้ไว้ ยาวๆ ไปเลยครับ",
  kick: "ช่วงท้าย: ถ้าหมดแรง อนุญาตให้ผ่อนได้นิดหน่อย เน้นเข้าเส้นชัยสวยๆ พอ!"
} : {
  // --- บทพูดแบบ Normal Mode (เดิม) ---
  warm: "ช่วงแรก: ดึงช้ากว่าความรู้สึก! เก็บแรงไว้",
  cruise: "ช่วงกลาง: เข้าสู่ Race Pace ล็อกให้นิ่งเหมือนหุ่นยนต์",
  kick: "ช่วงท้าย: ใส่ยับ! เร่งความเร็วแซงคนข้างหน้า!"
};
```

### สรุปความเจ๋ง

1.  **User รู้สึกควบคุมได้:** เขาเลือกความเสี่ยงเองได้
2.  **Real-time Feedback:** พอกด Switch ปุ๊บ ตัวเลข Pace ช่วงท้ายเปลี่ยนปั๊บ (จากเลขน้อย เป็นเลขมาก) เห็นผลทันตา
3.  **Low Effort:** ไม่ต้องแก้โครงสร้าง Data แค่เพิ่ม `if/else` ในสูตรคณิตศาสตร์ครับ

เริ่มเห็นภาพไหมครับ? ถ้าโอเค ผมว่าใส่ Feature นี้เข้าไป แอปดู Pro ขึ้น 200% เลยครับ\!