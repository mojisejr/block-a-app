import React from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

export function CalculationInfoDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-muted-foreground text-xs mt-4">
          <Info className="w-3 h-3 mr-1" />
          ดูที่มาของการคำนวณ (Calculation Logic)
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-center">วิทยาศาสตร์เบื้องหลังแผนการวิ่ง</DrawerTitle>
            <DrawerDescription className="text-center">
              กลยุทธ์ Negative Split
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[60vh] px-4">
            <div className="space-y-6 pb-6 text-sm text-left">
              <section>
                <h3 className="font-semibold text-primary mb-2">1. กลยุทธ์: Negative Split คืออะไร?</h3>
                <p className="text-muted-foreground">
                  นักวิ่งส่วนใหญ่มักจะทำพลาดด้วยการ "ออกตัวแรง" แล้วไป "หมดแรง" (Bonk) ในตอนท้าย 
                  แต่สูตรของเราจะแนะนำให้คุณทำตรงกันข้าม:
                </p>
                <ul className="list-disc list-inside mt-2 text-muted-foreground pl-2">
                  <li><strong>เริ่มให้ช้า:</strong> เพื่อประหยัดพลังงาน (Glycogen) ในร่างกาย</li>
                  <li><strong>จบให้เร็ว:</strong> ระเบิดพลังที่เหลือออกมาในขณะที่คนอื่นกำลังหมดแรง</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-primary mb-2">2. เราคำนวณตัวเลขของคุณอย่างไร?</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium text-foreground">A: หา "Base Pace" (ความเร็วเดินทาง) 🎯</h4>
                  <p className="text-muted-foreground mt-1">
                    เราหาความเร็วที่คุณสามารถวิ่งประคองไปได้เรื่อยๆ อย่างสบายๆ ถ้าคุณกำหนดเวลาจบ 
                    เราจะเผื่อเวลาให้คุณวิ่งช้าในช่วงแรกให้แล้ว
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground">B: สูตรลับ 3 ช่วง 📊</h4>
                  <div className="space-y-3 mt-2">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900">
                      <p className="font-semibold text-green-700 dark:text-green-400">🟢 ช่วงที่ 1: Warm Up (20% แรก)</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        วิ่งช้ากว่า Base Pace 12.5% เพื่อวอร์มกล้ามเนื้อและสงบจิตใจ
                      </p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900">
                      <p className="font-semibold text-yellow-700 dark:text-yellow-400">🟡 ช่วงที่ 2: The Cruise (60% กลาง)</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ความเร็วเท่ากับ Base Pace เป๊ะๆ ล็อกความเร็วให้นิ่งเหมือนหุ่นยนต์
                      </p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900">
                      <p className="font-semibold text-red-700 dark:text-red-400">🔴 ช่วงที่ 3: The Kick (20% ท้าย)</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        เร็วกว่า Base Pace 7.5% เทหมดหน้าตัก! ไล่แซงคนที่เริ่มมาเร็วเกินไป
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-primary mb-2">3. ทำไมสูตรนี้ถึงได้ผล?</h3>
                <p className="text-muted-foreground">
                  การเริ่มให้ช้ากว่าปกติจะช่วยชะลอความเหนื่อยล้า เมื่อคุณวิ่งมาถึง 20% สุดท้าย 
                  ในขณะที่คนอื่นกำลังขาหนัก คุณจะกลับรู้สึกสดชื่นและมีกำลังใจที่จะเร่งความเร็วเข้าเส้นชัย
                </p>
                <blockquote className="mt-4 border-l-2 border-primary pl-4 italic text-muted-foreground">
                  "การวิ่งมาราธอนไม่ได้วัดกันที่ว่าคุณเริ่มเร็วแค่ไหน แต่วัดกันที่ว่าคุณจบได้แข็งแกร่งเพียงใด"
                </blockquote>
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
