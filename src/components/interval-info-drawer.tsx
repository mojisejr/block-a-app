"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function IntervalInfoDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          วิธีคำนวณ
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-center">วิธีการคำนวณแผนซ้อม Interval</DrawerTitle>
            <DrawerDescription className="text-center">
              เข้าใจหลักการคำนวณตารางลงคอร์ท (Interval Training)
            </DrawerDescription>
          </DrawerHeader>
          
          <ScrollArea className="h-[60vh] px-4">
            <div className="space-y-6 pb-6 text-sm text-left">
            {/* Overview */}
            <section>
              <h3 className="font-semibold text-base mb-2">📊 ภาพรวม</h3>
              <p className="text-muted-foreground leading-relaxed">
                ระบบคำนวณแผนซ้อม Interval จากเป้าหมายการแข่งขันของคุณ
                โดยคำนึงถึงความปลอดภัยและพื้นฐานความฟิตปัจจุบัน
                เพื่อช่วยพัฒนาความเร็วอย่างมีประสิทธิภาพ
              </p>
            </section>

            {/* Step 1 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                1️⃣ คำนวณ Interval Pace (ความเร็วลงคอร์ท)
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>จากเป้าหมายการแข่งที่คุณใส่ ระบบจะคำนวณ:</p>
                <div className="bg-muted/50 p-3 rounded-md font-mono text-xs">
                  <div>Race Pace = เวลาเป้าหมาย ÷ ระยะทาง</div>
                  <div className="mt-2">Interval Pace = Race Pace × Speed Factor</div>
                </div>
                <div className="mt-2">
                  <p className="font-medium">Speed Factor ขึ้นอยู่กับระยะทาง:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1 mt-1">
                    <li><strong>5K / 10K</strong>: 0.94 (เร็วกว่า 6%)</li>
                    <li><strong>21K / 42K</strong>: 0.90 (เร็วกว่า 10%)</li>
                  </ul>
                </div>
                <p className="mt-2">
                  ตัวอย่าง: ถ้าเป้าหมาย 10K ใน 50 นาที (5:00/km) 
                  → Interval Pace = 5:00 × 0.94 = 4:42/km
                </p>
              </div>
            </section>

            {/* Step 2 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                2️⃣ คำนวณจำนวนรอบ (Volume & Safety)
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  ระบบจำกัด <strong>ระยะทางรวมของ Interval</strong> ไม่ให้เกิน
                  10-15% ของระยะสะสมต่อสัปดาห์ เพื่อป้องกันการบาดเจ็บ
                </p>
                <div className="bg-muted/50 p-3 rounded-md space-y-1">
                  <div className="font-medium">ระยะ Interval สูงสุด:</div>
                  <ul className="list-disc list-inside ml-2 space-y-1 text-xs">
                    <li><strong>Low</strong> (&lt;30 km/สัปดาห์): สูงสุด 3.5 km</li>
                    <li><strong>Mid</strong> (30-60 km/สัปดาห์): สูงสุด 6.0 km</li>
                    <li><strong>High</strong> (&gt;60 km/สัปดาห์): สูงสุด 10.0 km</li>
                    <li><strong>Custom</strong>: สูงสุด 15% ของระยะสะสมของคุณ</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-3 rounded-md font-mono text-xs mt-2">
                  จำนวนรอบ = Max Volume ÷ ระยะต่อรอบ<br />
                  (ขั้นต่ำ 3 รอบ)
                </div>
                <p className="mt-2">
                  ตัวอย่าง: ระดับ Low (3.5km) ลงคอร์ท 400m 
                  → 3.5 ÷ 0.4 = 8.75 → <strong>8 รอบ</strong>
                </p>
              </div>
            </section>

            {/* Step 3 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                3️⃣ คำนวณเวลาพัก (Recovery)
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>เวลาพักคำนวณจาก Work-to-Rest Ratio:</p>
                <div className="bg-muted/50 p-3 rounded-md space-y-1">
                  <div className="font-medium">กฎการพัก:</div>
                  <ul className="list-disc list-inside ml-2 space-y-1 text-xs">
                    <li>
                      <strong>คอร์ทสั้น</strong> (&lt;800m): Ratio <strong>1:1.5</strong>
                      <div className="ml-6 text-muted-foreground">
                        (เวลาพัก = เวลาวิ่ง × 1.5)
                      </div>
                    </li>
                    <li>
                      <strong>คอร์ทยาว</strong> (≥800m): Ratio <strong>1:1</strong>
                      <div className="ml-6 text-muted-foreground">
                        (เวลาพัก = เวลาวิ่ง × 1.0)
                      </div>
                    </li>
                  </ul>
                </div>
                <p className="mt-2">
                  ตัวอย่าง: วิ่ง 400m ใช้เวลา 1:53 
                  → เวลาพัก = 1:53 × 1.5 = 2:50
                </p>
                <p className="text-xs mt-2 italic">
                  *เวลาพักปัดเป็น 10 วินาที เพื่อความสะดวกในการจับเวลา
                </p>
              </div>
            </section>

            {/* Science */}
            <section className="border-t pt-4">
              <h3 className="font-semibold text-base mb-2">🔬 หลักการทางวิทยาศาสตร์</h3>
              <div className="space-y-2 text-muted-foreground text-xs">
                <div>
                  <p className="font-medium">ทำไมต้องเร็วกว่า Race Pace?</p>
                  <p className="ml-2">
                    การฝึก Interval ด้วยความเร็วสูงกว่าการแข่ง (6-10%) 
                    ช่วยพัฒนา VO2 Max และเพิ่มประสิทธิภาพการใช้ออกซิเจน
                    ทำให้ Race Pace รู้สึกสบายขึ้น
                  </p>
                </div>
                <div>
                  <p className="font-medium">ทำไมต้องจำกัด Volume?</p>
                  <p className="ml-2">
                    การซ้อม Interval มีความเข้มข้นสูง ถ้าทำมากเกินไป
                    จะเพิ่มความเสี่ยงต่อการบาดเจ็บและ Overtraining
                    กฎ 10-15% เป็นมาตรฐานที่นัก Sport Science แนะนำ
                  </p>
                </div>
                <div>
                  <p className="font-medium">ทำไมคอร์ทสั้นพักนานกว่า?</p>
                  <p className="ml-2">
                    คอร์ทสั้น (200-400m) ใช้ระบบ Anaerobic มากกว่า
                    ต้องให้เวลาร่างกายกำจัด Lactate ก่อนรอบต่อไป
                    คอร์ทยาว (800m+) ใช้ระบบ Aerobic มากกว่า ฟื้นตัวเร็วกว่า
                  </p>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section className="border-t pt-4">
              <h3 className="font-semibold text-base mb-2">💡 Tips จาก Coach</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-xs">
                <li>
                  <strong>วอร์มอัพ 15-20 นาที</strong> ก่อนลงคอร์ททุกครั้ง
                  วิ่งเบาๆ ยืดเหยียด และวิ่ง Strides 3-4 รอบ
                </li>
                <li>
                  <strong>รักษา Pace ให้สม่ำเสมอ</strong> ห้ามวิ่งรอบแรกเร็วเกินไป
                  ควบคุมอารมณ์ เน้นความสม่ำเสมอ
                </li>
                <li>
                  <strong>Cool Down</strong> วิ่งเบา 10 นาที หลังจากเสร็จ
                  เพื่อช่วยขับของเสียออกจากกล้ามเนื้อ
                </li>
                <li>
                  <strong>ซ้อม Interval 1-2 ครั้ง/สัปดาห์</strong> เท่านั้น
                  ให้ร่างกายมีเวลาพักฟื้นอย่างน้อย 72 ชั่วโมง
                </li>
                <li>
                  <strong>ฟังร่างกาย</strong> ถ้ารู้สึกเมื่อยมาก ปวดข้อ หรือไม่ฟิต
                  ให้งดซ้อมและพักผ่อน อย่าฝืน
                </li>
              </ul>
            </section>
          </div>
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">เข้าใจแล้ว</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
  );
}
