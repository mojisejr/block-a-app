"use client";

import { Droplet, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RacePlan } from "@/lib/calculator";
import { cn } from "@/lib/utils";
import { CalculationInfoDrawer } from "./calculation-info-drawer";

interface StepResultProps {
  plan: RacePlan;
  onReset: () => void;
}

export function StepResult({ plan, onReset }: StepResultProps) {
  const { phases, splits, estimatedTime, basePace } = plan;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Summary Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg font-medium text-muted-foreground">
            Estimated Finish Time
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-5xl font-bold tracking-tighter text-primary">
            {estimatedTime}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Base Pace: <span className="font-mono font-medium">{basePace}</span> /km
          </div>
          <CalculationInfoDrawer />
        </CardContent>
      </Card>

      {/* Narrative Strategy */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight">
          แผนพิชิต {plan.totalDistance}km ของคุณ
        </h3>
        
        {/* Phase 1: Warm Up */}
        <div className="relative border-l-4 border-green-500 pl-4 py-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              {phases.warmup.name}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {phases.warmup.range}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {phases.warmup.description}
          </p>
        </div>

        {/* Phase 2: Cruise */}
        <div className="relative border-l-4 border-blue-500 pl-4 py-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
              {phases.cruise.name}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {phases.cruise.range}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {phases.cruise.description}
          </p>
        </div>

        {/* Phase 3: Kick */}
        <div className="relative border-l-4 border-red-500 pl-4 py-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
              {phases.kick.name}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {phases.kick.range}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {phases.kick.description}
          </p>
        </div>
      </div>

      {/* Hydration Alert */}
      <Alert className="bg-blue-50/50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-300">
        <Droplet className="h-4 w-4" />
        <AlertTitle>Hydration Plan</AlertTitle>
        <AlertDescription>
          Drink water every 2-3km. Don't wait until you're thirsty.
        </AlertDescription>
      </Alert>

      {/* Splits Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight">Splits Breakdown</h3>
          <Button variant="outline" size="sm" onClick={() => {
            const text = `แผนพิชิต ${plan.totalDistance}km ของคุณ\n\n` +
              `${phases.warmup.name}\n${phases.warmup.description}\n\n` +
              `${phases.cruise.name}\n${phases.cruise.description}\n\n` +
              `${phases.kick.name}\n${phases.kick.description}\n\n` +
              `Estimated Finish: ${estimatedTime}`;
            navigator.clipboard.writeText(text);
            alert("Plan copied to clipboard!");
          }}>
            Copy Plan
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Km</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Pace</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {splits.map((split) => (
                <TableRow key={split.km}>
                  <TableCell className="font-medium">{split.km}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{split.phase}</TableCell>
                  <TableCell className="font-mono">{split.pace}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {split.cumulativeTime}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={onReset}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Calculate New Plan
      </Button>
    </div>
  );
}
