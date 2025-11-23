export type RaceDistance = 5 | 10 | 21 | 42;
export type TargetMode = "pace" | "time";

export interface PhaseData {
  name: string;
  range: string; // e.g., "0-2 km"
  distance: number; // km
  pace: string; // MM:SS
  paceSeconds: number;
  description: string;
}

export interface RacePlan {
  totalDistance: number;
  targetMode: TargetMode;
  targetValue: string; // Input value
  basePace: string; // Calculated Base Pace
  estimatedTime: string; // Total estimated time
  phases: {
    warmup: PhaseData;
    cruise: PhaseData;
    kick: PhaseData;
  };
  splits: { km: number; pace: string; cumulativeTime: string }[];
}

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

// Helper: Format seconds to "MM:SS" or "HH:MM:SS"
export function formatSecondsToTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Helper: Format seconds per km to "MM:SS"
export function formatSecondsToPace(secondsPerKm: number): string {
  const m = Math.floor(secondsPerKm / 60);
  const s = Math.round(secondsPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function calculateRacePlan(
  distance: number,
  targetValue: string,
  mode: TargetMode
): RacePlan {
  let basePaceSeconds = 0;

  // Step 1: Calculate Base Pace
  if (mode === "pace") {
    // Condition A: Input = Pace
    basePaceSeconds = parseTimeStringToSeconds(targetValue);
  } else {
    // Condition B: Input = Time
    const targetTimeSeconds = parseTimeStringToSeconds(targetValue);
    const avgPaceSeconds = targetTimeSeconds / distance;
    // Compensate: BasePace = AvgPace / 1.01
    basePaceSeconds = avgPaceSeconds / 1.01;
  }

  // Step 2: Calculate 3 Phases
  // Warm Up: 0-20% @ 1.125 * BasePace
  // Cruise: 20-80% @ 1.00 * BasePace
  // Kick: 80-100% @ 0.925 * BasePace

  const warmupPaceSeconds = basePaceSeconds * 1.125;
  const cruisePaceSeconds = basePaceSeconds * 1.0;
  const kickPaceSeconds = basePaceSeconds * 0.925;

  const warmupDist = distance * 0.2;
  const cruiseDist = distance * 0.6; // 80% - 20%
  const kickDist = distance * 0.2; // 100% - 80%

  // Create Phase Data
  const phases = {
    warmup: {
      name: "Warm Up",
      range: `0 - ${warmupDist} km`,
      distance: warmupDist,
      pace: formatSecondsToPace(warmupPaceSeconds),
      paceSeconds: warmupPaceSeconds,
      description: "Start slow to warm up.",
    },
    cruise: {
      name: "Cruise",
      range: `${warmupDist} - ${warmupDist + cruiseDist} km`,
      distance: cruiseDist,
      pace: formatSecondsToPace(cruisePaceSeconds),
      paceSeconds: cruisePaceSeconds,
      description: "Maintain steady pace.",
    },
    kick: {
      name: "Kick",
      range: `${warmupDist + cruiseDist} - ${distance} km`,
      distance: kickDist,
      pace: formatSecondsToPace(kickPaceSeconds),
      paceSeconds: kickPaceSeconds,
      description: "Finish strong!",
    },
  };

  // Step 3: Generate Splits and Total Time
  const splits: { km: number; pace: string; cumulativeTime: string }[] = [];
  let currentSeconds = 0;

  for (let i = 1; i <= distance; i++) {
    let paceSeconds = 0;
    if (i <= warmupDist) {
      paceSeconds = warmupPaceSeconds;
    } else if (i <= warmupDist + cruiseDist) {
      paceSeconds = cruisePaceSeconds;
    } else {
      paceSeconds = kickPaceSeconds;
    }

    currentSeconds += paceSeconds;
    splits.push({
      km: i,
      pace: formatSecondsToPace(paceSeconds),
      cumulativeTime: formatSecondsToTime(currentSeconds),
    });
  }

  // Handle non-integer distances (e.g. 21.1 or 42.195 if we supported them, but for now fixed integers)
  // If distance is 21, loop goes to 21.

  return {
    totalDistance: distance,
    targetMode: mode,
    targetValue,
    basePace: formatSecondsToPace(basePaceSeconds),
    estimatedTime: formatSecondsToTime(currentSeconds),
    phases,
    splits,
  };
}
