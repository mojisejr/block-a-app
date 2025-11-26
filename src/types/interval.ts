export type RaceDistance = '5k' | '10k' | '21k' | '42k';

export type WeeklyMileage = 'low' | 'mid' | 'high' | 'custom';
// low: < 30 km/week
// mid: 30 - 60 km/week
// high: > 60 km/week
// custom: user defined

export interface IntervalInput {
  targetDistance: RaceDistance;
  targetTime: string; // Format "HH:MM:SS" or "MM:SS"
  weeklyMileage: WeeklyMileage;
  customMileage?: number; // Used when weeklyMileage is 'custom'
  selectedIntervalDist: number; // e.g., 400, 800, 1000 (meters)
}

export interface IntervalPlan {
  pacePerKm: string;        // e.g. "4:30 /km"
  timePerRep: string;       // e.g. "01:48" (Time for 400m)
  reps: number;             // Number of repetitions (e.g., 10)
  totalDistanceKm: number;  // Total work distance
  restTime: string;         // e.g. "01:30"
  suggestion: string;       // Text summary
}
