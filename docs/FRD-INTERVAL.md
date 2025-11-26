นี่คือ **Feature Requirement Document (FRD) ฉบับสมบูรณ์ (Master Version)** สำหรับระบบ **Tempo Training Designer** ครับ

เอกสารนี้ถูกจัดทำในมาตรฐานเดียวกับระบบ Interval ก่อนหน้านี้ โดยเน้นความละเอียดทั้ง **Technical Logic** และ **Sports Science Principle** เพื่อให้คุณนำไปรวมเป็นเล่ม Documentation ใหญ่ของโปรเจกต์ได้เลย และ AI Agent สามารถอ่านแล้วเข้าใจทันทีครับ

-----

# Feature Requirement Document (FRD)

**Project Name:** Smart Race Pacer (LINE LIFF Edition)
**Module:** Smart Tempo Designer (ระบบออกแบบตารางซ้อมวิ่งต่อเนื่อง/ความอึด)
**Version:** 1.0 (Master Release)
**Date:** November 26, 2025
**Dependency:** Requires Core Logic from `Interval Module`
**Tech Stack:** Next.js 14, TypeScript, Shadcn UI

-----

## 1\. Introduction & Objectives

**"Smart Tempo Designer"** คือฟีเจอร์สำหรับคำนวณความเร็วและระยะเวลาในการฝึกซ้อมแบบ **Tempo Run** (Threshold Run) ซึ่งเป็นหัวใจสำคัญของการสร้างความอึด (Endurance) และการขยายขีดจำกัดความเหนื่อย (Lactate Threshold)

### 1.1 Core Value Proposition

1.  **Seamless Integration:** ใช้ข้อมูล Input เดียวกันกับ Interval Feature (Target Dist/Time/Mileage) ไม่ต้องกรอกใหม่
2.  **Scientific Accuracy:** คำนวณ Pace แบบ "Comfortably Hard" ที่ถูกต้องตามหลักสรีรวิทยา ไม่เร็วเกินไปจนกลายเป็น Race Pace และไม่ช้าเกินไปจนเป็น Easy Run
3.  **Safety Duration:** กำหนดระยะเวลาวิ่ง (Duration) ที่เหมาะสมกับพื้นฐานความฟิต (Mileage) ป้องกันการ Overtraining

-----

## 2\. Scientific Principles (ทฤษฎีและหลักการอ้างอิง)

### 2.1 The "Lactate Threshold" Concept

Tempo Run คือการวิ่งที่ความเร็วระดับ **Lactate Threshold (LT)** หรือจุดที่ร่างกายเริ่มสะสมกรดแลคติกในกระแสเลือดเร็วกว่าที่กำจัดออก

  * **ความรู้สึก:** "Comfortably Hard" (เหนื่อยแต่ทนได้) หรือระดับความเหนื่อย 7-8 เต็ม 10
  * **ประโยชน์:** เพื่อดันจุด LT ให้สูงขึ้น ทำให้นักวิ่งสามารถวิ่งที่ความเร็วสูงขึ้นได้นานขึ้นโดยไม่หมดแรง

### 2.2 Pace Logic vs. Race Distance

ความเร็วของ Tempo จะแปรผันตามระยะทางเป้าหมาย (Target Distance):

  * **5K/10K Target:** Tempo Pace จะ **"ช้ากว่า"** Race Pace (เพราะ Race Pace ของ 5K คือ VO2Max ซึ่งสูงกว่า LT)
  * **Half/Full Marathon Target:** Tempo Pace จะ **"เร็วกว่า"** Race Pace (เพื่อกระตุ้นระบบ Aerobic Power ให้สูงกว่าความเร็วที่ใช้แข่งจริง)

### 2.3 Duration Rule (กฎของเวลา)

Tempo Run ไม่ได้วัดที่ระยะทางเป็นหลัก แต่วัดที่ **"Time under tension"** (ระยะเวลาต่อเนื่อง):

  * **Beginner:** ควรวิ่งต่อเนื่องอย่างน้อย 20 นาที เพื่อให้เกิด Effect
  * **Advanced:** ไม่ควรวิ่งต่อเนื่องเกิน 60 นาทีในการซ้อมครั้งเดียว เพราะความล้าจะสูงเกินประโยชน์ที่ได้รับ

-----

## 3\. Data Structures (Types & Interfaces)

ใช้ Input ร่วมกับ Interval แต่มี Output Interface เฉพาะตัว

```typescript
// types/tempo.ts

// Import shared types from Interval module
import { IntervalInput, RaceDistance, WeeklyMileage } from './interval';

export interface TempoPlan {
  // Main Metrics
  targetPace: string;       // Pace ที่ต้องวิ่ง (min/km) e.g., "05:15"
  durationMinutes: number;  // เวลาที่ต้องวิ่งต่อเนื่อง (นาที)
  totalDistanceKm: number;  // ระยะทางรวมโดยประมาณ (km)
  
  // Session Structure
  warmUpText: string;       // คำแนะนำวอร์มอัพ
  mainSetText: string;      // คำอธิบายช่วงวิ่งหลัก
  coolDownText: string;     // คำแนะนำคูลดาวน์
  
  // UX/Guidance
  intensityDescription: string; // คำอธิบายความรู้สึก e.g., "Comfortably Hard"
}
```

-----

## 4\. Business Logic & Algorithm (สูตรคำนวณ)

ส่วนสำหรับ `utils/tempo-calculator.ts`

### Step 1: Input Processing

ดึงค่าจาก `IntervalInput`:

1.  `TargetDistance` (5k, 10k, 21k, 42k)
2.  `TargetTime` -\> แปลงเป็น **Base Race Pace ($P_{race}$)** (วินาที/กม.)
3.  `WeeklyMileage` (low, mid, high)

### Step 2: Calculate Tempo Pace ($P_{tempo}$)

ปรับ Pace ตามระยะทางเป้าหมายเพื่อให้เข้าโซน Threshold:

  * **Case A: Target 5K / 10K**
    $$P_{tempo} = P_{race} + 15 \text{ seconds}$$
    *(วิ่งช้ากว่าแข่ง 15 วินาที/กม. เพื่อเลี้ยงความเหนื่อย)*

  * **Case B: Target 21K (Half Marathon)**
    $$P_{tempo} = P_{race} - 5 \text{ seconds}$$
    *(วิ่งเร็วกว่าแข่งเล็กน้อย เพื่อสร้าง Buffer)*

  * **Case C: Target 42K (Full Marathon)**
    $$P_{tempo} = P_{race} - 20 \text{ seconds}$$
    *(วิ่งเร็วกว่าแข่งมาราธอนพอสมควร เพื่อกระตุ้น LT)*

### Step 3: Calculate Duration ($T_{duration}$)

กำหนดเวลาวิ่งตาม Mileage Cap:

  * **Low Mileage (\<30km):** $20$ นาที
  * **Mid Mileage (30-60km):** $35$ นาที
  * **High Mileage (\>60km):** $50$ นาที

### Step 4: Final Assembly

1.  **Total Distance:** $(P_{tempo\_sec} \times T_{duration\_min} \times 60) / 1000$
2.  **Warm Up:** Fixed Text "Jogging 2 km + Dynamic Stretching"
3.  **Cool Down:** Fixed Text "Jogging 1 km (Easy)"

-----

## 5\. User Interface (UI) Specification

**Location:** `components/training-designer.tsx` (Refactor from `interval-designer.tsx`)

### 5.1 Integrated Form

ยังคงใช้ Input Form เดิม (User ไม่ต้องกรอกอะไรเพิ่ม) แต่เปลี่ยนปุ่ม Action เป็น **"Generate Training Plan"**

### 5.2 Result Display (Tabs System)

เมื่อคำนวณเสร็จ ให้แสดงผลด้วย **Tabs Component** (Shadcn UI):

#### **Tab 1: Interval (Speed)**

*(แสดงผล Interval Card เดิม)*

#### **Tab 2: Tempo (Stamina) \<-- New\!**

แสดงผล Tempo Card โดยมี Layout ดังนี้:

**Header Section (Theme: Orange/Amber)**

  * **Title:** "Tempo Run (Stamina Builder)"
  * **Main Stat:**
      * Left: **{Duration} Mins** (Label: Duration)
      * Right: **{Pace} /km** (Label: Target Pace)

**Timeline Section (Vertical List)**

1.  🟢 **Warm Up:** "วิ่งจ๊อกสบายๆ 2 km + ยืดเหยียด"
2.  🟠 **The Grind (Main Set):**
      * "วิ่งต่อเนื่อง **{Duration} นาที** ห้ามเดิน\!"
      * "รักษาความเร็ว **Pace {Pace}**"
      * "ความรู้สึก: เหนื่อยแต่ทนได้ (Comfortably Hard)"
3.  🔵 **Cool Down:** "วิ่งจ๊อกคลายกล้ามเนื้อ 1 km"

**Footer Note:**

  * "💡 **Pro Tip:** Tempo Run ช่วยให้คุณวิ่งได้อึดขึ้น ควรฝึกสัปดาห์ละ 1 ครั้ง"

-----

## 6\. Development Checklist for Agent

คำสั่งสำหรับ AI Agent:

1.  [ ] **Types:** Create `types/tempo.ts` and ensure it imports/extends `interval.ts`.
2.  [ ] **Logic:** Implement `utils/tempo-calculator.ts` following strict math rules in Section 4.
3.  [ ] **Refactor UI:** Rename `interval-designer.tsx` to `training-designer.tsx`.
4.  [ ] **Implement Tabs:** Wrap the result section with Shadcn `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.
5.  [ ] **Create Tempo View:** Implement the Tempo Card UI inside the second tab.
6.  [ ] **Verify Math:**
      * *Test Input:* 10K Target / 50:00 Time / Low Mileage.
      * *Expect:* Pace 5:15 (5:00+15s), Duration 20 mins.

-----