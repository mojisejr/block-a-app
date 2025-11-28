"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";
import { format, differenceInDays, startOfDay } from "date-fns";
import { th } from "date-fns/locale";
import { Plus, Calendar as CalendarIcon, StickyNote, Trash2, Pencil } from "lucide-react";

import { RaceEvent } from "@/types/event";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function RaceCalendar() {
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useLocalStorage<RaceEvent[]>("my_race_events", []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isActionsDialogOpen, setIsActionsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<RaceEvent | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [notes, setNotes] = useState("");

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenDialog = (eventToEdit?: RaceEvent) => {
    if (eventToEdit) {
      setEditingId(eventToEdit.id);
      setTitle(eventToEdit.title);
      const eventDate = new Date(eventToEdit.date);
      setDay(eventDate.getDate().toString());
      setMonth((eventDate.getMonth() + 1).toString());
      setYear(eventDate.getFullYear().toString());
      setNotes(eventToEdit.notes || "");
    } else {
      setEditingId(null);
      setTitle("");
      setDay("");
      setMonth("");
      setYear("");
      setNotes("");
    }
    setIsDialogOpen(true);
  };

  const handleOpenActionsDialog = (event: RaceEvent) => {
    setSelectedEvent(event);
    setIsActionsDialogOpen(true);
  };

  const handleEdit = () => {
    if (selectedEvent) {
      setIsActionsDialogOpen(false);
      handleOpenDialog(selectedEvent);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedEvent) {
      handleDelete(selectedEvent.id);
      setIsActionsDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleSave = () => {
    if (!title || !day || !month || !year) return;

    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    if (editingId) {
      // Edit
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingId ? { ...ev, title, date, notes } : ev
        )
      );
    } else {
      // Add
      const newEvent: RaceEvent = {
        id: uuidv4(),
        title,
        date,
        notes,
        createdAt: Date.now(),
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  // Sort events: Nearest date first
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getDaysRemaining = (eventDate: Date) => {
    const today = startOfDay(new Date());
    const target = startOfDay(new Date(eventDate));
    return differenceInDays(target, today);
  };

  const getBadgeInfo = (days: number) => {
    if (days < 0) return { label: "Finished", labelTh: "จบแล้ว", color: "text-muted-foreground bg-muted" };
    if (days === 0) return { label: "Race Day!", labelTh: "วันนี้!", color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 animate-pulse" };
    if (days === 1) return { label: "Tomorrow!", labelTh: "พรุ่งนี้!", color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400" };
    if (days < 7) return { label: `${days} Days`, labelTh: `อีก ${days} วัน`, color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400" };
    if (days > 30) return { label: `${days} Days`, labelTh: `อีก ${days} วัน`, color: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400" };
    return { label: `${days} Days`, labelTh: `อีก ${days} วัน`, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" };
  };

  // Generate day, month, year options
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: "1", label: "มกราคม (Jan)" },
    { value: "2", label: "กุมภาพันธ์ (Feb)" },
    { value: "3", label: "มีนาคม (Mar)" },
    { value: "4", label: "เมษายน (Apr)" },
    { value: "5", label: "พฤษภาคม (May)" },
    { value: "6", label: "มิถุนายน (Jun)" },
    { value: "7", label: "กรกฎาคม (Jul)" },
    { value: "8", label: "สิงหาคม (Aug)" },
    { value: "9", label: "กันยายน (Sep)" },
    { value: "10", label: "ตุลาคม (Oct)" },
    { value: "11", label: "พฤศจิกายน (Nov)" },
    { value: "12", label: "ธันวาคม (Dec)" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">งานวิ่งของฉัน (My Races)</h2>
          <p className="text-sm text-muted-foreground">
            จัดการตารางแข่งขัน
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} size="sm" className="h-9">
          <Plus className="mr-2 h-4 w-4" /> เพิ่มงาน
        </Button>
      </div>

      {!mounted ? (
        <div className="grid gap-4">
          <div className="h-32 rounded-lg border bg-muted/50 animate-pulse" />
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/50">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <CalendarIcon className="h-10 w-10 opacity-50" />
                <p>ยังไม่มีรายการแข่ง</p>
                <p className="text-xs">No races added yet</p>
                <Button variant="link" onClick={() => handleOpenDialog()}>
                  เพิ่มงานแรกของคุณ
                </Button>
              </div>
            </div>
          ) : (
            sortedEvents.map((event, index) => {
              const days = getDaysRemaining(event.date);
              const badge = getBadgeInfo(days);
              
              return (
                <Card 
                  key={event.id} 
                  className="group relative transition-all hover:shadow-md border-muted animate-in fade-in slide-in-from-bottom-4 cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleOpenActionsDialog(event)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg font-bold leading-none">
                          {event.title}
                        </CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                          {format(new Date(event.date), "d MMMM yyyy", { locale: th })}
                        </div>
                        {event.notes && (
                          <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-2">
                            <StickyNote className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{event.notes}</span>
                          </div>
                        )}
                      </div>
                      <div 
                        className={cn(
                          "flex items-center justify-center px-4 py-2 rounded-lg text-base font-bold shadow-sm whitespace-nowrap",
                          badge.color
                        )}
                      >
                        {badge.labelTh}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "แก้ไขงานวิ่ง (Edit Race)" : "เพิ่มงานวิ่งใหม่ (Add New Race)"}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">ชื่องาน (Event Name)</Label>
              <Input
                id="title"
                placeholder="เช่น บางแสน 42 (e.g. Bangsaen 42)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>วันที่แข่งขัน (Race Date)</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">วัน (Day)</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">-</option>
                    {days.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">เดือน (Month)</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">-</option>
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">ปี (Year)</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">-</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">บันทึก (Notes) <span className="text-xs text-muted-foreground">(optional)</span></Label>
              <Input
                id="notes"
                placeholder="เช่น เป้าหมาย Sub 4 (e.g. Target Sub 4)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              ยกเลิก (Cancel)
            </Button>
            <Button onClick={handleSave} disabled={!title || !day || !month || !year}>
              บันทึก (Save)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Actions Dialog */}
      <Dialog open={isActionsDialogOpen} onOpenChange={setIsActionsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent && format(new Date(selectedEvent.date), "d MMMM yyyy", { locale: th })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 py-4">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12" 
              onClick={handleEdit}
            >
              <Pencil className="mr-2 h-4 w-4" />
              แก้ไข (Edit)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleDeleteConfirm}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              ลบ (Delete)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
