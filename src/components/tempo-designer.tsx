"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { calculateTempoPlan } from "@/lib/tempo-calculator";
import { IntervalInput, RaceDistance, WeeklyMileage } from "@/types/interval";
import { TempoPlan } from "@/types/tempo";
import { Timer, Footprints, Flame, Zap } from "lucide-react";
import { TempoInfoDrawer } from "./tempo-info-drawer";
import { SocialShareButton } from "./social-share-button";

export function TempoDesigner() {
  const [input, setInput] = useState<IntervalInput>({
    targetDistance: "10k",
    targetTime: "",
    weeklyMileage: "low",
    selectedIntervalDist: 400, // Not used for Tempo but required by type
  });
  const [plan, setPlan] = useState<TempoPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    setLoading(true);
    // Simulate a small delay for better UX
    setTimeout(() => {
      const result = calculateTempoPlan(input);
      setPlan(result);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tempo Designer</h1>
        <TempoInfoDrawer />
      </div>

      <Card className="border-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            ออกแบบตาราง Tempo
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
                      ? "bg-orange-500 text-white border-orange-500"
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
                      ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500 dark:bg-orange-950/20"
                      : "border-input hover:bg-muted/50"
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    input.weeklyMileage === option.value ? "border-orange-500" : "border-muted-foreground"
                  }`}>
                    {input.weeklyMileage === option.value && (
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
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

          <Button 
            className="w-full h-12 text-lg mt-4 bg-orange-500 hover:bg-orange-600 text-white" 
            onClick={handleCalculate}
            disabled={!input.targetTime || loading || (input.weeklyMileage === 'custom' && !input.customMileage)}
          >
            {loading ? "Calculating..." : "คำนวณแผน Tempo"}
          </Button>
        </CardContent>
      </Card>

      {plan && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-orange-50 dark:bg-orange-950/10 border-orange-200 dark:border-orange-900">
            <CardContent className="pt-6 space-y-6">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Target Tempo Pace</p>
                <div className="text-5xl font-black text-orange-600 dark:text-orange-500 tracking-tighter">
                  {plan.targetPace}
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.intensityDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg border text-center space-y-1">
                  <div className="flex items-center justify-center text-muted-foreground mb-1">
                    <Timer className="h-4 w-4 mr-1" />
                    <span className="text-xs">Duration</span>
                  </div>
                  <div className="text-2xl font-bold">{plan.durationMinutes} <span className="text-sm font-normal text-muted-foreground">mins</span></div>
                </div>
                <div className="bg-background p-4 rounded-lg border text-center space-y-1">
                  <div className="flex items-center justify-center text-muted-foreground mb-1">
                    <Footprints className="h-4 w-4 mr-1" />
                    <span className="text-xs">Distance</span>
                  </div>
                  <div className="text-2xl font-bold">~{plan.totalDistanceKm}</div>
                  <div className="text-xs text-muted-foreground">km</div>
                </div>
              </div>

              <div className="space-y-3 bg-background/50 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50">
                 <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">WU</div>
                    <div className="text-sm">{plan.warmUpText}</div>
                 </div>
                 <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">MS</div>
                    <div className="text-sm font-medium">{plan.mainSetText}</div>
                 </div>
                 <div className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">CD</div>
                    <div className="text-sm">{plan.coolDownText}</div>
                 </div>
              </div>

              <Alert className="bg-background border-orange-200 dark:border-orange-900">
                <Flame className="h-4 w-4 text-orange-500" />
                <AlertTitle>Coach Suggestion</AlertTitle>
                <AlertDescription className="text-muted-foreground mt-1">
                  {plan.suggestion}
                </AlertDescription>
              </Alert>
              <div className="flex justify-center pt-2">
                <SocialShareButton 
                  mainStat={plan.targetPace}
                  subStat="Tempo Pace"
                  details={[
                    { label: "Duration", value: `${plan.durationMinutes} mins` },
                    { label: "Distance", value: `~${plan.totalDistanceKm} km` },
                    { label: "Main Set", value: plan.mainSetText },
                  ]}
                  buttonLabel="Share Plan"
                  variant="blocka"
                  title="Tempo Plan"
                  warmUpText={plan.warmUpText}
                  coolDownText={plan.coolDownText}
                  suggestion={plan.suggestion}
                  intensityDescription={plan.intensityDescription}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
