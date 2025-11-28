นี่คือ **Feature Requirement Document (FRD)** ฉบับสมบูรณ์ละเอียดที่สุด (Master Version) สำหรับฟีเจอร์ **Race Countdown Manager** และ **Social Share System** ครับ

เอกสารนี้รวบรวม **Technical Specification**, **Business Logic (CRUD)**, และ **UI Guidelines** ไว้อย่างครบถ้วนเพื่อให้ AI Coding Agent สามารถทำงานได้ทันทีโดยไม่ต้องถามซ้ำครับ

คุณสามารถ Save ไฟล์นี้เป็น `feature-engagement.md` แล้วส่งให้ Agent ได้เลยครับ

-----

# Feature Requirement Document (FRD)

**Project Name:** Smart Race Pacer (LINE LIFF Edition)
**Module:** User Engagement & Utilities (Countdown & Sharing)
**Version:** 1.0 (Master Release)
**Date:** November 27, 2025
**Tech Stack:** Next.js 14, TypeScript, Shadcn UI, `usehooks-ts`, `html2canvas`, `uuid`, `date-fns`

-----

## Feature 1: Race Countdown Manager (List Mode with CRUD)

**Objective:**
สร้างระบบจัดการตารางการแข่งขัน (Race Calendar) ส่วนตัวของ User โดยบันทึกข้อมูลลง LocalStorage (Stateless) สามารถเพิ่ม, ลบ, แก้ไข และดูวันคงเหลือของแต่ละงานได้แบบ Real-time

### 1.1 Data Structure (Types)

```typescript
// types/event.ts

export interface RaceEvent {
  id: string;         // UUID (Unique Identifier) - ห้ามซ้ำ
  title: string;      // ชื่องานวิ่ง e.g. "Bangsaen 42"
  date: Date;         // วันที่จัดงาน (ISO String or Date Object)
  createdAt: number;  // Timestamp
}

export type EventStatus = 'upcoming' | 'today' | 'finished';
```

### 1.2 Business Logic (Core Functions)

**1. Storage Management:**

  * **Library:** ใช้ `useLocalStorage` (from `usehooks-ts`)
  * **Key:** `'my_race_events'`
  * **Default Value:** Empty Array `[]`

**2. CRUD Operations:**

  * **Create (Add):**
      * Generate `new UUID`.
      * Push new object to array.
  * **Read (List & Sort):**
      * เรียงลำดับ (Sort) ตาม `date` จากน้อยไปมาก (งานที่ใกล้ที่สุดขึ้นก่อน)
      * filter งานที่จบไปแล้ว (Optional: หรือจะแสดงแต่ย้ายไปล่างสุดก็ได้)
  * **Update (Edit):**
      * ค้นหา Event ใน Array ด้วย `id`.
      * Update fields (`title`, `date`) **โดยห้ามเปลี่ยน `id`**.
      * Save ทับลงไปใน Array เดิม
  * **Delete (Remove):**
      * Filter Array เพื่อเอา object ที่มี `id` ตรงกันออก

**3. Countdown Calculation:**

  * **Formula:** `Days = Math.ceil((EventDate - Today) / (1000 * 60 * 60 * 24))`
  * **Status Logic:**
      * Days \> 1: Show "อีก {Days} วัน"
      * Days == 1: Show "พรุ่งนี้\!"
      * Days == 0: Show "วันนี้\! (Race Day)"
      * Days \< 0: Show "จบแล้ว (Finished)"

### 1.3 UI Specifications (`components/race-calendar.tsx`)

**A. Header Section:**

  * **Title:** "ปฏิทินงานวิ่ง (My Races)"
  * **Action:** ปุ่ม `Button` (Variant: Ghost/Outline, Size: Icon) รูป `Plus` (+) สำหรับเพิ่มรายการ

**B. Event List (Scroll Area):**

  * ใช้ `ScrollArea` ของ Shadcn UI (Height: approx 200px-300px)
  * ถ้า Array ว่าง (`length === 0`): แสดง Placeholder text "ยังไม่มีรายการแข่ง กด + เพื่อเพิ่ม"

**C. Event Card Item (Component):**

  * **Design:** Bordered Card เล็กๆ หรือ List Item
  * **Left Content:**
      * Line 1: `title` (Font-weight: Bold)
      * Line 2: `date` (Format: "d MMM yyyy" using `date-fns` และเป็นภาษาไทยถ้าเป็นไปได้)
  * **Middle Content:**
      * `Badge` แสดงจำนวนวันคงเหลือ (สีแดงถ้า \< 7 วัน, สีเขียวถ้า \> 30 วัน)
  * **Right Content (Actions):**
      * Dropdown Menu (3 dots `MoreHorizontal` icon):
          * Item 1: ✏️ **แก้ไข (Edit)** -\> เปิด Dialog Edit
          * Item 2: 🗑️ **ลบ (Delete)** -\> ลบรายการทันที (หรือมี Alert confirm)

**D. Management Dialog (Add/Edit Form):**

  * ใช้ `Dialog` Component เดียวกันทั้งการ Add และ Edit
  * **State:**
      * `mode`: 'add' | 'edit'
      * `editingId`: string | null
  * **Form Fields:**
      * Input: "ชื่องาน" (Placeholder: "เช่น บางแสน 42")
      * DatePicker (Calendar): "วันที่แข่งขัน"
  * **Buttons:** "ยกเลิก", "บันทึก"

-----

## Feature 2: Social Share System (Image Generator)

**Objective:**
แปลงผลลัพธ์แผนการซ้อม (Training Result) ให้เป็นไฟล์รูปภาพ (PNG) เพื่อให้ User สามารถ Save หรือ Share ลง Social Media ได้

### 2.1 Technical Logic (Canvas Generation)

**Concept:** เราจะไม่ Capture หน้าจอตรงๆ แต่จะสร้าง "Hidden Container" ที่จัด Layout ไว้สวยงามสำหรับเป็นรูปภาพโดยเฉพาะ (Export Layout) แล้วสั่ง Render เป็น Image

**Workflow:**

1.  User กดปุ่ม "Share Plan".
2.  App จะ Render Component พิเศษชื่อ `<ShareTemplate />` (ซึ่งปกติซ่อนอยู่ หรืออยู่นอก Viewport).
3.  ใช้ `html2canvas` จับภาพ Component นั้น.
4.  แปลงเป็น `DataURL` (Base64 PNG).
5.  แสดงผลลัพธ์ใน Modal.

### 2.2 UI Specifications (`components/social-share.tsx`)

**A. Trigger Button:**

  * วางปุ่ม `Share` (Icon) ไว้ในหน้า Result Card (ทั้ง Interval และ Tempo Tabs).
  * Label: "Share Plan"

**B. Share Template (The Hidden View):**

  * **Container Style:**
      * Size: Fixed Width (e.g., 600px) - *Note: html2canvas will capture specific size.*
      * Background: Gradient สวยๆ (Brand Color).
      * Padding: 40px.
      * Font: Kanit / Sarabun.
  * **Content:**
      * **Header:** Logo App + "Smart Race Pacer"
      * **Title:** "ภารกิจซ้อมของฉัน" (My Mission)
      * **Main Stat:** แสดงตัวเลขใหญ่ๆ เช่น "Tempo 30 นาที" หรือ "10 x 400m".
      * **Details:** Pace, Rest, Total Distance.
      * **Footer:** "Generated by Smart Race Pacer" (Credit).

**C. Result Modal (Dialog):**

  * **Title:** "แผนซ้อมพร้อมแชร์\!"
  * **Content:** แสดงรูปภาพ `img` (src = base64) ที่ Gen มาได้
  * **Instruction:** Text "แตะค้างที่รูปเพื่อบันทึก หรือส่งต่อ"
  * **Action:** ปุ่ม "Close"

-----

## 3\. Implementation Checklist for Agent

Please follow these steps strictly to implement the features:

**Step 1: Setup & Dependencies**

1.  [ ] Install libraries: `npm install usehooks-ts html2canvas uuid date-fns lucide-react`
2.  [ ] Create types in `types/event.ts`.

**Step 2: Implement Countdown (CRUD)**
3\.  [ ] Create `components/race-calendar.tsx`.
4\.  [ ] Implement `useLocalStorage` hook for `'my_race_events'`.
5\.  [ ] Build the **Dialog Form** first (Validation: Title required, Date required).
6\.  [ ] Build the **List View** with logic:
\* Sort events by date ASC.
\* Calculate 'Days Remaining' for badges.
7\.  [ ] Connect **CRUD Actions**:
\* Add: Create new UUID.
\* Edit: Update existing UUID logic (Do not create new ID).
\* Delete: Filter array.

**Step 3: Implement Social Share**
8\.  [ ] Create `components/share-template.tsx` (The component to be captured). Style it to look premium (Gradient background, White text).
9\.  [ ] Create `components/social-share-button.tsx`.
10\. [ ] Implement `handleShare` function:
\* Use `html2canvas` to target the template ref.
\* Set `scale: 2` or `3` for high resolution.
\* Open a Dialog with the result image.

**Step 4: Integration**
11\. [ ] Place `<RaceCalendar />` at the top of the main page (Dashboard).
12\. [ ] Place `<SocialShareButton />` inside the Result Cards of Interval and Tempo features.

-----