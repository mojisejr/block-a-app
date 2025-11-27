import { calculateRacePlan, formatSecondsToPace, parseTimeStringToSeconds } from "../lib/calculator";

function runTest(name: string, actual: any, expected: any) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr === expectedStr) {
    console.log(`✅ ${name} Passed`);
  } else {
    console.error(`❌ ${name} Failed`);
    console.error(`   Expected: ${expectedStr}`);
    console.error(`   Actual:   ${actualStr}`);
  }
}

function testCalculator() {
  console.log("Running Calculator Tests...");

  // Test 1: Parse Time
  runTest("Parse 1:00:00", parseTimeStringToSeconds("1:00:00"), 3600);
  runTest("Parse 05:00", parseTimeStringToSeconds("05:00"), 300);

  // Test 2: Format Pace
  runTest("Format 300s", formatSecondsToPace(300), "5:00");
  runTest("Format 356.4s", formatSecondsToPace(356.4), "5:56"); // Rounding check

  // Test 3: 10k Target Time 60 mins
  // Avg Pace = 6:00 (360s)
  // Base Pace = 360 / 1.01 = 356.43s (~5:56)
  // Warm Up = 356.43 * 1.125 = 400.99s (~6:41)
  // Cruise = 356.43 * 1.0 = 356.43s (~5:56)
  // Kick = 356.43 * 0.925 = 329.70s (~5:30)

  const plan = calculateRacePlan(10, "1:00:00", "time");

  console.log("\n--- 10k Target Time 1:00:00 ---");
  console.log("Base Pace:", plan.basePace);
  console.log("Warm Up Pace:", plan.phases.warmup.pace);
  console.log("Cruise Pace:", plan.phases.cruise.pace);
  console.log("Kick Pace:", plan.phases.kick.pace);
  console.log("Estimated Time:", plan.estimatedTime);

  runTest("Base Pace", plan.basePace, "5:56");
  runTest("Warm Up Pace", plan.phases.warmup.pace, "6:41");
  runTest("Cruise Pace", plan.phases.cruise.pace, "5:56");
  runTest("Kick Pace", plan.phases.kick.pace, "5:30");
  
  // Verify Splits Length
  runTest("Splits Length", plan.splits.length, 10);
}

testCalculator();
