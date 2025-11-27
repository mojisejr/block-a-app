import { calculateIntervalPlan } from "../lib/interval-calculator";
import { IntervalInput } from "@/types/interval";

function runTest(name: string, actual: any, expected: any) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  // Simple check for key values to avoid floating point issues in string comparison if possible, 
  // but for this simple object, stringify might work if order is same.
  // Better to check specific fields.
  
  let passed = true;
  if (actual.reps !== expected.reps) passed = false;
  if (actual.restTime !== expected.restTime) passed = false;
  // Pace might vary slightly due to floating point, so we check approximate if needed, 
  // but let's see if exact match works with the logic.
  if (actual.pacePerKm !== expected.pacePerKm) passed = false;

  if (passed) {
    console.log(`✅ ${name} Passed`);
  } else {
    console.error(`❌ ${name} Failed`);
    console.error(`   Expected: ${expectedStr}`);
    console.error(`   Actual:   ${actualStr}`);
  }
}

function testIntervalCalculator() {
  console.log("Running Interval Calculator Tests...");

  // Case A: 10k / 50:00 / Low / 400m
  // Race Pace = 50:00 / 10 = 5:00/km = 300s/km
  // Interval Pace = 300 * 0.94 = 282s/km = 4:42/km
  // Max Volume (Low) = 3.5km
  // Reps = floor(3.5 / 0.4) = 8 reps
  // Time Per Rep = 282 * 0.4 = 112.8s
  // Rest Ratio (400m < 800m) = 1.5
  // Rest Time = 112.8 * 1.5 = 169.2s -> Round to nearest 10 -> 170s = 02:50
  
  const inputA: IntervalInput = {
    targetDistance: '10k',
    targetTime: "50:00",
    weeklyMileage: 'low',
    selectedIntervalDist: 400
  };

  const resultA = calculateIntervalPlan(inputA);
  runTest("Case A", {
    pacePerKm: resultA.pacePerKm,
    reps: resultA.reps,
    restTime: resultA.restTime
  }, {
    pacePerKm: "4:42 /km",
    reps: 8,
    restTime: "02:50"
  });

  // Case B: 42k / 4:00:00 / High / 1000m
  // Race Pace = 240 mins / 42.195 = 5.6878 min/km = 341.27s/km
  // Interval Pace = 341.27 * 0.90 = 307.14s/km = 5:07/km
  // Max Volume (High) = 10.0km
  // Reps = floor(10.0 / 1.0) = 10 reps
  // Time Per Rep = 307.14 * 1.0 = 307.14s
  // Rest Ratio (1000m >= 800m) = 1.0
  // Rest Time = 307.14 * 1.0 = 307.14s -> Round to nearest 10 -> 310s = 05:10
  
  const inputB: IntervalInput = {
    targetDistance: '42k',
    targetTime: "4:00:00",
    weeklyMileage: 'high',
    selectedIntervalDist: 1000
  };

  const resultB = calculateIntervalPlan(inputB);
  runTest("Case B", {
    pacePerKm: resultB.pacePerKm,
    reps: resultB.reps,
    restTime: resultB.restTime
  }, {
    pacePerKm: "5:07 /km",
    reps: 10,
    restTime: "05:10"
  });
  // Case C: Custom Mileage 80km
  // Max Volume = 80 * 0.15 = 12.0km
  // Interval Dist = 1000m
  // Reps = floor(12.0 / 1.0) = 12 reps
  
  const inputC: IntervalInput = {
    targetDistance: '10k',
    targetTime: "40:00",
    weeklyMileage: 'custom',
    customMileage: 80,
    selectedIntervalDist: 1000
  };

  const resultC = calculateIntervalPlan(inputC);
  runTest("Case C (Custom 80km)", {
    reps: resultC.reps
  }, {
    reps: 12
  });
}

testIntervalCalculator();
