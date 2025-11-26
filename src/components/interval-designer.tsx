"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { calculateIntervalPlan } from "@/lib/interval-calculator";
import { IntervalInput, IntervalPlan, RaceDistance, WeeklyMileage } from "@/types/interval";
import { ArrowLeft, Timer, Activity, Footprints, Flame } from "lucide-react";
import Link from "next/link";
import { IntervalInfoDrawer } from "./interval-info-drawer";

export function IntervalDesigner() {
  const [input, setInput] = useState<IntervalInput>({
    targetDistance: "10k",
    targetTime: "",
    weeklyMileage: "low",
    selectedIntervalDist: 400,
  });
  const [plan, setPlan] = useState<IntervalPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    setLoading(true);
    // Simulate a small delay for better UX
    setTimeout(() => {
      const result = calculateIntervalPlan(input);
      setPlan(result);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Interval Designer</h1>
        <IntervalInfoDrawer />
      </div>

      <Card className="border-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            ออกแบบตารางลงคอร์ท
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Target Distance */}
          <div className="space-y-2">
            <Label>ระยะทางเป้าหมาย (Target Distance)</Label>
            <div className="grid grid-cols-4 gap-2">
              {(['5k', '10k', '21k', '42k'] as RaceDistance[]).map((dist) => (
                <button
                  key={dist}
                  onClick={() => setInput({ ...input, targetDistance: dist })}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                    input.targetDistance === dist
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-input"
                  }`}
                >
                  {dist.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Target Time */}
          <div className="space-y-2">
            <Label htmlFor="targetTime">เวลาเป้าหมาย (Target Time)</Label>
            <Input
              id="targetTime"
              placeholder="e.g. 50:00 or 1:45:00"
              value={input.targetTime}
              onChange={(e) => setInput({ ...input, targetTime: e.target.value })}
              className="text-lg font-mono"
            />
            <p className="text-xs text-muted-foreground">Format: MM:SS or HH:MM:SS</p>
          </div>

          {/* Weekly Mileage */}
          <div className="space-y-2">
            <Label>ซ้อมวิ่งสัปดาห์ละ? (Weekly Mileage)</Label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: 'low', label: '< 30 km (Low)' },
                { value: 'mid', label: '30 - 60 km (Mid)' },
                { value: 'high', label: '> 60 km (High)' },
                { value: 'custom', label: 'Custom (ระบุเอง)' },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => setInput({ ...input, weeklyMileage: option.value as WeeklyMileage })}
                  className={`flex items-center space-x-3 p-3 rounded-md border cursor-pointer transition-all ${
                    input.weeklyMileage === option.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-input hover:bg-muted/50"
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    input.weeklyMileage === option.value ? "border-primary" : "border-muted-foreground"
                  }`}>
                    {input.weeklyMileage === option.value && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              ))}
            </div>
            
            {input.weeklyMileage === 'custom' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
                <Label htmlFor="customMileage" className="text-xs text-muted-foreground">ระบุระยะสะสมต่อสัปดาห์ (km)</Label>
                <Input
                  id="customMileage"
                  type="number"
                  placeholder="e.g. 80"
                  value={input.customMileage || ''}
                  onChange={(e) => setInput({ ...input, customMileage: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Interval Distance */}
          <div className="space-y-2">
            <Label>ระยะลงคอร์ท (Interval Distance)</Label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={input.selectedIntervalDist}
              onChange={(e) => setInput({ ...input, selectedIntervalDist: Number(e.target.value) })}
            >
              <option value={200}>200 meters</option>
              <option value={400}>400 meters</option>
              <option value={800}>800 meters</option>
              <option value={1000}>1000 meters</option>
              <option value={1600}>1600 meters (1 mile)</option>
            </select>
          </div>

          <Button 
            className="w-full h-12 text-lg mt-4" 
            onClick={handleCalculate}
            disabled={!input.targetTime || loading || (input.weeklyMileage === 'custom' && !input.customMileage)}
          >
            {loading ? "Calculating..." : "คำนวณแผนซ้อม"}
          </Button>
        </CardContent>
      </Card>

      {plan && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 space-y-6">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Time Per Rep</p>
                <div className="text-5xl font-black text-primary tracking-tighter">
                  {plan.timePerRep}
                </div>
                <p className="text-sm text-muted-foreground">
                  at Pace {plan.pacePerKm}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg border text-center space-y-1">
                  <div className="flex items-center justify-center text-muted-foreground mb-1">
                    <Footprints className="h-4 w-4 mr-1" />
                    <span className="text-xs">Reps</span>
                  </div>
                  <div className="text-2xl font-bold">{plan.reps} <span className="text-sm font-normal text-muted-foreground">x {input.selectedIntervalDist}m</span></div>
                  <div className="text-xs text-muted-foreground">Total {plan.totalDistanceKm} km</div>
                </div>
                <div className="bg-background p-4 rounded-lg border text-center space-y-1">
                  <div className="flex items-center justify-center text-muted-foreground mb-1">
                    <Timer className="h-4 w-4 mr-1" />
                    <span className="text-xs">Rest</span>
                  </div>
                  <div className="text-2xl font-bold">{plan.restTime}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
              </div>

              <Alert className="bg-background border-primary/20">
                <Flame className="h-4 w-4 text-orange-500" />
                <AlertTitle>Coach Suggestion</AlertTitle>
                <AlertDescription className="text-muted-foreground mt-1">
                  {plan.suggestion}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
