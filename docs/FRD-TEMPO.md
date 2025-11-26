// types/tempo.ts (Or append to existing types)

import { RaceDistance, WeeklyMileage } from './interval';

// Input uses the EXACT SAME structure as IntervalInput
// We just don't need 'selectedIntervalDist' for Tempo calculations

export interface TempoPlan {
  targetPace: string;       // e.g. "05:15 /km"
  durationMinutes: number;  // e.g. 30 (minutes)
  totalDistanceKm: number;  // e.g. 5.5 km (Calculated from pace * duration)
  description: string;      // Explanation text
  warmUp: string;           // e.g. "2 km Easy Jog"
  coolDown: string;         // e.g. "1 km Easy Jog"
}