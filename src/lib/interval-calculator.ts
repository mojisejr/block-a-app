import { IntervalInput, IntervalPlan } from "@/types/interval";

// Helper: Parse "MM:SS" or "HH:MM:SS" to seconds
export function parseTimeStringToSeconds(timeStr: string): number {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

// Helper: Format seconds per km to "MM:SS"
export function formatSecondsToPace(secondsPerKm: number): string {
  const m = Math.floor(secondsPerKm / 60);
  const s = Math.round(secondsPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Helper: Format seconds to "MM:SS" (for rep time and rest time)
export function formatSecondsToTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function calculateIntervalPlan(input: IntervalInput): IntervalPlan {
  // Step 1: Parse Inputs
  const targetTimeSeconds = parseTimeStringToSeconds(input.targetTime);
  let distanceKm = 0;
  switch (input.targetDistance) {
    case '5k': distanceKm = 5; break;
    case '10k': distanceKm = 10; break;
    case '21k': distanceKm = 21.0975; break;
    case '42k': distanceKm = 42.195; break;
  }
  
  const racePaceSecondsPerKm = targetTimeSeconds / distanceKm;

  // Step 2: Calculate Interval Pace (Intensity)
  let speedFactor = 0.94; // Default for 5k/10k
  if (input.targetDistance === '21k' || input.targetDistance === '42k') {
    speedFactor = 0.90;
  }

  const intervalPaceSecondsPerKm = racePaceSecondsPerKm * speedFactor;

  // Step 3: Calculate Repetitions (Volume & Safety)
  let maxVolumeKm = 3.5; // Default Low
  if (input.weeklyMileage === 'mid') maxVolumeKm = 6.0;
  if (input.weeklyMileage === 'high') maxVolumeKm = 10.0;
  if (input.weeklyMileage === 'custom' && input.customMileage) {
    // Rule: Max 15% of weekly mileage
    maxVolumeKm = input.customMileage * 0.15;
  }

  const intervalDistKm = input.selectedIntervalDist / 1000;
  let reps = Math.floor(maxVolumeKm / intervalDistKm);
  if (reps < 3) reps = 3; // Minimum Clamp

  const totalDistanceKm = reps * intervalDistKm;

  // Step 4: Calculate Rest Time (Recovery)
  const timePerRepSeconds = intervalPaceSecondsPerKm * intervalDistKm;
  
  let restRatio = 1.5;
  if (input.selectedIntervalDist >= 800) {
    restRatio = 1.0;
  }

  let restTimeSeconds = timePerRepSeconds * restRatio;
  // Round to nearest 10 seconds
  restTimeSeconds = Math.round(restTimeSeconds / 10) * 10;

  // Suggestion Text
  let suggestion = "";
  if (input.weeklyMileage === 'low') {
    suggestion = `Safety First: เนื่องจากคุณวิ่งสะสมน้อย (<30k) เราจึงจำกัดจำนวนรอบไว้ที่ ${reps} รอบ เพื่อป้องกันการบาดเจ็บ`;
  } else if (input.weeklyMileage === 'mid') {
    suggestion = `Balanced Plan: สำหรับระยะสะสมปานกลาง แผนนี้จะช่วยพัฒนาความเร็วโดยไม่โหลดร่างกายเกินไป (${reps} รอบ)`;
  } else if (input.weeklyMileage === 'high') {
    suggestion = `High Performance: จัดเต็มได้เลย! ด้วยฐานแอโรบิคที่ดี คุณสามารถลงคอร์ทได้ถึง ${reps} รอบ`;
  } else {
    suggestion = `Custom Plan: คำนวณจากระยะสะสม ${input.customMileage}km ของคุณ (จำกัด Volume ไม่เกิน 15% = ${maxVolumeKm.toFixed(1)}km)`;
  }

  return {
    pacePerKm: `${formatSecondsToPace(intervalPaceSecondsPerKm)} /km`,
    timePerRep: formatSecondsToTime(timePerRepSeconds),
    reps: reps,
    totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
    restTime: formatSecondsToTime(restTimeSeconds),
    suggestion: suggestion
  };
}
