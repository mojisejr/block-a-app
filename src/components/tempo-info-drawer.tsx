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
import { Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TempoInfoDrawer() {
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
            <DrawerTitle className="text-center">วิธีการคำนวณแผนซ้อม Tempo</DrawerTitle>
            <DrawerDescription className="text-center">
              เข้าใจหลักการคำนวณ Tempo Run (Threshold Run)
            </DrawerDescription>
          </DrawerHeader>
          
          <ScrollArea className="h-[60vh] px-4">
            <div className="space-y-6 pb-6 text-sm text-left">
            {/* Overview */}
            <section>
              <h3 className="font-semibold text-base mb-2">📊 ภาพรวม</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tempo Run คือการวิ่งที่ความเร็วระดับ Lactate Threshold (LT) 
                หรือจุดที่ร่างกายเริ่มสะสมกรดแลคติก เพื่อสร้างความอึด (Endurance) 
                และความรู้สึก "Comfortably Hard" (เหนื่อยแต่ทนได้)
              </p>
            </section>

            {/* Step 1 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                1️⃣ คำนวณ Tempo Pace (ความเร็ว)
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>ความเร็ว Tempo จะแปรผันตามระยะทางเป้าหมาย:</p>
                <div className="bg-muted/50 p-3 rounded-md font-mono text-xs">
                  <div>Race Pace = เวลาเป้าหมาย ÷ ระยะทาง</div>
                </div>
                <div className="mt-2">
                  <ul className="list-disc list-inside ml-2 space-y-1 mt-1">
                    <li><strong>5K / 10K</strong>: ช้ากว่า Race Pace 15 วินาที/กม.</li>
                    <li><strong>21K</strong>: เร็วกว่า Race Pace 5 วินาที/กม.</li>
                    <li><strong>42K</strong>: เร็วกว่า Race Pace 20 วินาที/กม.</li>
                  </ul>
                </div>
                <p className="mt-2 text-xs italic">
                  *เป้าหมายระยะสั้น (5K/10K) ต้องวิ่ง Tempo ช้ากว่าแข่ง เพราะ Race Pace คือ VO2Max (สูงกว่า LT)
                </p>
              </div>
            </section>

            {/* Step 2 */}
            <section>
              <h3 className="font-semibold text-base mb-2">
                2️⃣ คำนวณ Duration (ระยะเวลา)
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  Tempo Run วัดที่ "Time under tension" หรือระยะเวลาต่อเนื่อง 
                  โดยกำหนดตามพื้นฐานความฟิต (Mileage):
                </p>
                <div className="bg-muted/50 p-3 rounded-md space-y-1">
                  <ul className="list-disc list-inside ml-2 space-y-1 text-xs">
                    <li><strong>Low</strong> (&lt;30 km/สัปดาห์): 20 นาที</li>
                    <li><strong>Mid</strong> (30-60 km/สัปดาห์): 35 นาที</li>
                    <li><strong>High</strong> (&gt;60 km/สัปดาห์): 50 นาที</li>
                  </ul>
                </div>
                <p className="mt-2">
                  Beginner ควรวิ่งต่อเนื่องอย่างน้อย 20 นาทีเพื่อให้เกิดผลลัพธ์ 
                  และไม่ควรเกิน 60 นาทีในการซ้อมครั้งเดียว
                </p>
              </div>
            </section>

            {/* Tips */}
            <section className="border-t pt-4">
              <h3 className="font-semibold text-base mb-2">💡 Tips จาก Coach</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-xs">
                <li>
                  <strong>Warm Up</strong> วิ่งจ๊อก 2km + ยืดเหยียดก่อนเริ่มเสมอ
                </li>
                <li>
                  <strong>The Grind</strong> ช่วงวิ่ง Tempo ห้ามเดิน! ให้รักษาระดับความเหนื่อยที่ 7-8/10 ตลอดเวลา
                </li>
                <li>
                  <strong>Frequency</strong> ควรฝึกสัปดาห์ละ 1 ครั้ง
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
