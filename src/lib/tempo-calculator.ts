import { IntervalInput } from "@/types/interval";
import { TempoPlan } from "@/types/tempo";
import { parseTimeStringToSeconds, formatSecondsToPace } from "./interval-calculator";

export function calculateTempoPlan(input: IntervalInput): TempoPlan {
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

  // Step 2: Calculate Tempo Pace
  let tempoPaceSecondsPerKm = racePaceSecondsPerKm;

  if (input.targetDistance === '5k' || input.targetDistance === '10k') {
    // Slower than race pace by 15s
    tempoPaceSecondsPerKm += 15;
  } else if (input.targetDistance === '21k') {
    // Faster than race pace by 5s
    tempoPaceSecondsPerKm -= 5;
  } else if (input.targetDistance === '42k') {
    // Faster than race pace by 20s
    tempoPaceSecondsPerKm -= 20;
  }

  // Step 3: Calculate Duration
  let durationMinutes = 20; // Default Low
  if (input.weeklyMileage === 'mid') durationMinutes = 35;
  if (input.weeklyMileage === 'high') durationMinutes = 50;
  if (input.weeklyMileage === 'custom' && input.customMileage) {
    // Logic for custom mileage not explicitly defined in FRD for duration, 
    // but we can infer based on the tiers. 
    // Let's stick to the tiers for now or map custom mileage to tiers.
    // FRD says: <30 -> 20min, 30-60 -> 35min, >60 -> 50min
    if (input.customMileage < 30) durationMinutes = 20;
    else if (input.customMileage <= 60) durationMinutes = 35;
    else durationMinutes = 50;
  }

  // Step 4: Final Assembly
  const totalRunDistanceKm = (tempoPaceSecondsPerKm > 0) 
    ? (durationMinutes * 60) / tempoPaceSecondsPerKm 
    : 0; // Avoid division by zero if something is wrong

  const paceString = formatSecondsToPace(tempoPaceSecondsPerKm);

  return {
    targetPace: `${paceString} /km`,
    durationMinutes: durationMinutes,
    totalDistanceKm: Number(totalRunDistanceKm.toFixed(2)),
    warmUpText: "Jogging 2 km + Dynamic Stretching",
    mainSetText: `Run ${durationMinutes} mins @ ${paceString} /km`,
    coolDownText: "Jogging 1 km (Easy)",
    intensityDescription: "Comfortably Hard (7-8/10)",
    suggestion: "Tempo Run helps increase your Lactate Threshold. Do this once a week."
  };
}
