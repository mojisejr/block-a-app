import { RaceDistance, WeeklyMileage } from './interval';

export interface TempoPlan {
  // Main Metrics
  targetPace: string;       // e.g. "05:15 /km"
  durationMinutes: number;  // e.g. 30 (minutes)
  totalDistanceKm: number;  // e.g. 5.5 km
  
  // Session Structure
  warmUpText: string;
  mainSetText: string;
  coolDownText: string;
  
  // UX/Guidance
  intensityDescription: string;
  suggestion: string;
}
