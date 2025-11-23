"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RaceDistance } from "@/lib/calculator";

interface StepDistanceProps {
  onSelect: (distance: RaceDistance) => void;
  selectedDistance?: RaceDistance;
}

const DISTANCES: { value: RaceDistance; label: string; desc: string }[] = [
  { value: 5, label: "5K", desc: "Fun Run" },
  { value: 10, label: "10K", desc: "Mini Marathon" },
  { value: 21, label: "21K", desc: "Half Marathon" },
  { value: 42, label: "42K", desc: "Full Marathon" },
];

export function StepDistance({ onSelect, selectedDistance }: StepDistanceProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Choose Your Distance</h2>
        <p className="text-muted-foreground">
          Select the race distance you want to plan for.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DISTANCES.map((dist) => (
          <Card
            key={dist.value}
            className={cn(
              "cursor-pointer transition-all hover:border-primary hover:shadow-md",
              selectedDistance === dist.value
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "bg-card"
            )}
            onClick={() => onSelect(dist.value)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <span className="text-3xl font-bold tracking-tight">
                {dist.label}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {dist.desc}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
