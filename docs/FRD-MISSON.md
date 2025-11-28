นี่คือ **Feature Requirement Document (FRD)** ฉบับสมบูรณ์สำหรับฟีเจอร์ **"Smart Training Campaign Manager"** ครับ

เอกสารนี้ถูกเขียนขึ้นโดยยึด **Design System** เดิมของโปรเจกต์ (Shadcn UI + Tailwind) อย่างเคร่งครัด เน้น Mobile-first Experience และความลื่นไหลของ Transition ตามที่คุณต้องการ คุณสามารถนำไฟล์นี้ไปใช้สั่งงานทีม Dev หรือ AI Coding Agent ได้ทันทีครับ

-----

# Feature Requirement Document (FRD)

**Project Name:** Smart Race Pacer (LINE LIFF Edition)
**Module:** Campaign & Training Log Manager
**Version:** 1.0 (Master Release)
**Date:** November 28, 2025
**Tech Stack:** Next.js 14, TypeScript, Shadcn UI, `usehooks-ts`, `date-fns`

-----

## 1\. Feature Overview (บทนำ)

**"Smart Training Campaign Manager"** คือระบบบริหารจัดการตารางซ้อมแบบ **Cycle-based** (อิงตามฤดูกาลแข่งขัน) ที่ออกแบบมาเพื่อแก้ Pain Point ของการจดบันทึกแบบเดิมๆ โดยเปลี่ยนจากการ "จดทีละวัน" มาเป็นการ **"วางแผน (Plan) vs. ลงมือทำ (Actual)"**

**Key Capabilities:**

1.  **Season Management:** กำหนดเป้าหมายเป็นรอบๆ (Campaign) มีวันเริ่มและวันจบชัดเจน เมื่อจบแล้วสามารถ Archive เก็บไว้ดูประวัติได้ แล้วเริ่มรอบใหม่
2.  **Plan vs Actual:** รองรับสถานะความเป็นจริงของนักวิ่ง เช่น **เจ็บ (Injury)**, **วิ่งไม่จบ (DNF)**, หรือ **โดดซ้อม (Skipped)** ไม่ใช่แค่ Done อย่างเดียว
3.  **External Link Bridge:** แปะลิงก์จาก Strava/Garmin เพื่อเก็บเป็น Portfolio ส่วนตัว
4.  **Weekly Batch Planning:** เครื่องมือช่วยวางแผนรายสัปดาห์ (ใส่ตารางทีเดียว 7 วันรวด)

-----

## 2\. Data Architecture (Database Design)

เนื่องจากเราใช้ **LocalStorage** (Stateless Backend) โครงสร้างข้อมูลต้องออกแบบให้สัมพันธ์กันแบบ Relational database เล็กๆ เพื่อประสิทธิภาพในการ Query และ Archive

### 2.1 Types & Interfaces

```typescript
// types/campaign.ts

export type WorkoutType = 'rest' | 'easy' | 'tempo' | 'interval' | 'longrun' | 'race';
export type ExecutionStatus = 'planned' | 'done' | 'dnf' | 'skipped' | 'injury';

// 1. ตารางหลัก: ข้อมูล Campaign (Season)
export interface TrainingCampaign {
  id: string;             // UUID
  name: string;           // e.g. "Road to Bangsaen 42"
  targetGoal: string;     // e.g. "Sub 4 Marathon"
  startDate: string;      // ISO Date (YYYY-MM-DD)
  raceDate: string;       // ISO Date (YYYY-MM-DD)
  status: 'active' | 'archived';
  createdAt: number;
  
  // Summary (คำนวณตอน Archive)
  finalResult?: string;   // e.g. "4:15:00"
  totalDistance?: number;
  consistencyScore?: number; // 0-100%
}

// 2. ตารางรอง: บันทึกรายวัน (Log)
export interface DailyLog {
  id: string;             // UUID
  campaignId: string;     // Foreign Key -> TrainingCampaign.id
  date: string;           // ISO Date (YYYY-MM-DD) - ใช้เป็น Key หลักในการค้นหา
  
  // --- ส่วนแผน (Plan) ---
  planType: WorkoutType;
  planTitle: string;      // e.g. "Tempo 10k"
  planDistance: number;   // km
  planNote?: string;      // e.g. "โค้ชสั่งให้คุม HR โซน 3"

  // --- ส่วนผลงานจริง (Actual) ---
  status: ExecutionStatus;
  actualDistance?: number;
  actualDuration?: string; // MM:SS
  actualUrl?: string;     // Link to Strava/Garmin
  actualFeeling?: 'great' | 'good' | 'hard' | 'dead'; // Emoji feedback
  actualNote?: string;    // e.g. "ตะคริวขึ้นกิโลที่ 8"
}
```

-----

## 3\. User Journey & Flow

### 3.1 Onboarding (New Campaign)

  * **Trigger:** เข้าเมนู "Training Log" ครั้งแรก หรือกด "Start New Season" หลังจาก Archive อันเก่า
  * **UI:** Dialog หรือ Drawer เต็มจอ
  * **Input:**
      * "ตั้งชื่อ Season นี้หน่อย" (Input Text)
      * "วันประลอง (Race Day)" (Calendar Picker)
      * "เป้าหมายในใจ" (Input Text)
  * **Action:** ระบบสร้าง `TrainingCampaign` ใหม่ (Active) และเคลียร์ View ปฏิทินให้พร้อมใช้งาน

### 3.2 The Planning Mode (Weekly Batch)

  * **Context:** ผู้ใช้ได้รับตารางจากโค้ช หรือวางแผนเองรายสัปดาห์
  * **Trigger:** ปุ่ม "วางแผนสัปดาห์นี้" (Plan This Week)
  * **UI:** **Accordion List** ไล่ตั้งแต่วันจันทร์-อาทิตย์
      * แต่ละวันมี Dropdown เลือก Type (Easy, Tempo, etc.) และ Input ระยะทางคร่าวๆ
  * **Logic:** เมื่อกด Save ระบบจะสร้าง `DailyLog` ล่วงหน้า 7 วัน โดยตั้งสถานะเป็น `planned` (แสดงผลเป็นสีจางๆ ในปฏิทิน)

### 3.3 The Execution Mode (Daily Check-in)

  * **Context:** วิ่งเสร็จแล้ว หรือวันนี้ป่วยวิ่งไม่ได้
  * **Trigger:** กดที่วันที่ในปฏิทิน
  * **UI:** **Action Sheet / Drawer** เด้งขึ้นมาจากด้านล่าง
  * **Scenario A: วิ่งจบ (Done)**
      * กดปุ่ม "Complete" -\> กรอกเวลา/ระยะ -\> แปะลิงก์ Strava -\> Save
      * *Result:* จุดสีเปลี่ยนเป็น **Solid Color**
  * **Scenario B: มีปัญหา (Issue)**
      * กดปุ่ม "Report Issue" -\> เลือก Status:
          * 🚑 **Injury:** ระบบถาม "พักกี่วัน?" -\> Auto-change วันถัดไปเป็น Rest
          * 💀 **DNF:** บังคับใส่ Note สาเหตุ
          * 💤 **Skip:** บันทึกว่าโดด
      * *Result:* จุดสีเปลี่ยนเป็น 🔴 (Injury) หรือ 🟡 (DNF) หรือ ⚪ (Skip)

-----

## 4\. UI/UX Design & Specifications

เน้น Design Language ที่ **Clean, Modern, and Motivation-driven**

### 4.1 Component: The Season Dashboard (Header)

ส่วนบนสุดของหน้า Training Log

  * **Layout:** Card ที่มี Background Gradient บางๆ
  * **Content:**
      * **Headline:** ชื่อ Campaign ("Bangsaen 42")
      * **Sub-head:** Countdown ("อีก 45 วัน จะถึงวันแข่ง")
      * **Consistency Bar:** หลอดพลัง (Progress Bar) แสดง % การซ้อมสำเร็จในสัปดาห์นี้ (คำนวณจาก `Done / Total Planned`)

### 4.2 Component: Smart Calendar

ใช้ `react-day-picker` (Shadcn Calendar) แต่ปรับแต่ง `modifiers` ขั้นสูง

  * **Custom Indicators (จุดใต้ตัวเลขวันที่):**
      * ⚪ **Hollow Circle (วงกลมโปร่ง):** มีแผน (Planned) แต่ยังไม่ถึงวัน/ยังไม่ทำ
      * 🟢 **Solid Green:** สำเร็จ (Done)
      * 🟠 **Solid Orange:** สำเร็จแต่ไม่สมบูรณ์ (DNF)
      * 🔴 **Solid Red:** บาดเจ็บ (Injury)
      * ⚫ **Solid Gray:** โดดซ้อม (Skipped)
  * **Interaction:** เมื่อแตะวันที่ Active ให้มี Ring Animation เล็กน้อย

### 4.3 Component: The Log Ticket (Detail View)

เมื่อเลือกวันที่ ให้แสดง Card ด้านล่างปฏิทิน ดีไซน์เป็นตั๋ว (Ticket)

  * **Visual:** Card ที่มีรอยปรุ (Dashed border) แบ่งส่วนซ้ายขวา หรือบนล่าง
  * **State: Planned (Ghost Mode)**
      * Opacity: 60%
      * Icon: นาฬิกาทราย
      * Text: "รอการ Check-in"
      * Button: "ลงผลการซ้อม" (Primary Color)
  * **State: Done (Success Mode)**
      * Opacity: 100%
      * Header: Badge "COMPLETED" + Emoji Feeling
      * Body: แสดง Stat ตัวใหญ่ (Distance / Pace)
      * Footer: ปุ่ม "View on Strava/Garmin" (Icon Link)

### 4.4 Transition & Animations

  * **Page Load:** `FadeIn` เบาๆ
  * **Opening Log:** `SlideUp` จากด้านล่าง (Drawer pattern)
  * **Status Change:** เมื่อกดเปลี่ยนสถานะจาก Planned -\> Done ให้มี Effect `Confetti` เล็กๆ หรือ Icon `Check` เด้งขึ้นมา (Micro-interaction)

-----

## 5\. Business Logic (Algorithm)

### 5.1 Consistency Score Calculation

สูตรคำนวณความสม่ำเสมอ เพื่อแสดงใน Dashboard:

$$Score = (\frac{Count(Status == 'done')}{Count(Total \ Log \ in \ Past)}) \times 100$$

*(ไม่นับรวมวันที่มี Plan เป็น Rest)*

### 5.2 Auto-Rest Logic (Injury Handling)

เมื่อ User เลือกสถานะ **Injury** และระบุจำนวนวันพัก (N วัน):

1.  Loop หา `DailyLog` ในอนาคต N วันถัดไป
2.  Update `planType` เป็น `rest`
3.  Update `planNote` เป็น "Recovery from Injury"
4.  User ไม่ต้องไปนั่งแก้เองทีละวัน

### 5.3 Archive Logic

เมื่อกด "Finish Campaign":

1.  รวบรวม Stat ทั้งหมด (Total Distance, Total Time).
2.  Update `TrainingCampaign` -\> status = 'archived'.
3.  ข้อมูล Log ทั้งหมดยังคงอยู่ใน LocalStorage แต่จะไม่ถูก Query มาแสดงในหน้าปัจจุบัน (Filter `campaignId` เอาเฉพาะ Active).

-----

## 6\. Implementation Checklist (For Agent)

**Phase 1: Setup & Types**

1.  [ ] Create `types/campaign.ts` with defined Interfaces.
2.  [ ] Setup `useLocalStorage` hooks for keys: `'my_campaigns'` and `'my_daily_logs'`.

**Phase 2: Components (UI)**
3\.  [ ] Create `components/campaign-header.tsx` (Dashboard).
4\.  [ ] Create `components/smart-calendar.tsx` (With custom dot modifiers).
5\.  [ ] Create `components/log-ticket.tsx` (The detail card).
6\.  [ ] Create `components/weekly-plan-wizard.tsx` (Dialog for batch add).
7\.  [ ] Create `components/checkin-drawer.tsx` (Form for execution log).

**Phase 3: Logic Integration**
8\.  [ ] Implement **CRUD** for Campaigns (Create / Archive).
9\.  [ ] Implement **Query Logic**: `getLogsByMonth(date, campaignId)`.
10\. [ ] Implement **Status Logic**: Handle `Injury` auto-update.
11\. [ ] Implement **Link Handler**: Validate and store Strava/Garmin URLs.

**Phase 4: Polish**
12\. [ ] Add **Confetti** effect on "Mark as Done".
13\. [ ] Ensure **Responsive Design** fits perfectly on mobile screens (No horizontal scroll).

-----

**Note to Developer:** ฟีเจอร์นี้มีความซับซ้อนของ State มากกว่าฟีเจอร์อื่นๆ ขอให้เน้นที่การจัดการ `campaignId` ให้ถูกต้อง เพื่อไม่ให้ Log ของ Season เก่ามาปนกับ Season ใหม่ครับ