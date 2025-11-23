"use client";

import { useState } from "react";
import { ArrowLeft, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TargetMode } from "@/lib/calculator";

interface StepInputProps {
  onBack: () => void;
  onCalculate: (target: string, mode: TargetMode) => void;
  distance: number;
}

export function StepInput({ onBack, onCalculate, distance }: StepInputProps) {
  const [mode, setMode] = useState<TargetMode>("pace");
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;
    onCalculate(value, mode);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Set Your Target</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {distance}K Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="pace"
            onValueChange={(v) => setMode(v as TargetMode)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="pace">Target Pace</TabsTrigger>
              <TabsTrigger value="time">Target Time</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TabsContent value="pace" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pace">Pace (min/km)</Label>
                  <Input
                    id="pace"
                    placeholder="e.g. 6:00"
                    className="text-center text-2xl h-14 font-mono tracking-wider"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Format: MM:SS (e.g., 05:30)
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="time" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Total Time</Label>
                  <Input
                    id="time"
                    placeholder="e.g. 1:00:00"
                    className="text-center text-2xl h-14 font-mono tracking-wider"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Format: HH:MM:SS or MM:SS
                  </p>
                </div>
              </TabsContent>

              <Button type="submit" size="lg" className="w-full text-lg h-12">
                <Calculator className="mr-2 h-5 w-5" />
                Analyze Race Plan
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
