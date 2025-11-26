"use client";

import { useState } from "react";
import { SplashScreen } from "@/components/splash-screen";
import { StepDistance } from "@/components/step-distance";
import { StepInput } from "@/components/step-input";
import { StepResult } from "@/components/step-result";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { calculateRacePlan, RaceDistance, RacePlan, TargetMode } from "@/lib/calculator";

type Step = "distance" | "input" | "result";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState<Step>("distance");
  const [distance, setDistance] = useState<RaceDistance | null>(null);
  const [plan, setPlan] = useState<RacePlan | null>(null);
  const [isBonkMode, setIsBonkMode] = useState(false);

  const handleDistanceSelect = (dist: RaceDistance) => {
    setDistance(dist);
    setStep("input");
  };

  const handleCalculate = (targetValue: string, mode: TargetMode) => {
    if (!distance) return;
    const result = calculateRacePlan(distance, targetValue, mode, isBonkMode);
    setPlan(result);
    setStep("result");
  };

  const handleBonkModeChange = (checked: boolean) => {
    setIsBonkMode(checked);
    if (plan && distance) {
      const newPlan = calculateRacePlan(distance, plan.targetValue, plan.targetMode, checked);
      setPlan(newPlan);
    }
  };

  const handleReset = () => {
    setStep("distance");
    setDistance(null);
    setPlan(null);
    setIsBonkMode(false);
  };

  return (
    <>
      {/* {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />} */}

      <div className="min-h-screen bg-background font-sans text-foreground flex flex-col pb-20">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4 max-w-md mx-auto">
            <Logo />
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container max-w-md mx-auto px-4 py-8">
          {step === "distance" && (
            <StepDistance
              onSelect={handleDistanceSelect}
              selectedDistance={distance || undefined}
            />
          )}

          {step === "input" && distance && (
            <StepInput
              distance={distance}
              onBack={() => setStep("distance")}
              onCalculate={handleCalculate}
            />
          )}

          {step === "result" && plan && (
            <StepResult 
              plan={plan} 
              onReset={handleReset} 
              isBonkMode={isBonkMode}
              onBonkModeChange={handleBonkModeChange}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-muted-foreground">
          <p>Block A Running Club</p>
          <p className="text-xs mt-1">"There are no finish line"</p>
        </footer>
      </div>
    </>
  );
}
