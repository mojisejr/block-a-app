import { describe, it, expect } from 'vitest';
import { calculateTempoPlan } from '../lib/tempo-calculator';
import { IntervalInput } from '@/types/interval';

describe('calculateTempoPlan', () => {
  it('should calculate correctly for 10K target, 50:00 time, low mileage', () => {
    const input: IntervalInput = {
      targetDistance: '10k',
      targetTime: '50:00',
      weeklyMileage: 'low',
      selectedIntervalDist: 400, // Irrelevant
    };

    const result = calculateTempoPlan(input);

    // Race Pace: 50:00 / 10km = 5:00 /km
    // Tempo Pace: 5:00 + 15s = 5:15 /km
    expect(result.targetPace).toBe('5:15 /km');
    
    // Low Mileage -> 20 mins
    expect(result.durationMinutes).toBe(20);

    // Distance: 20 mins * (1km / 5.25 mins) = 3.81 km
    // 5:15 = 315 seconds/km
    // 20 mins = 1200 seconds
    // Distance = 1200 / 315 = 3.8095...
    expect(result.totalDistanceKm).toBeCloseTo(3.81, 2);
  });

  it('should calculate correctly for 21K target, 1:45:00 time, mid mileage', () => {
    const input: IntervalInput = {
      targetDistance: '21k',
      targetTime: '1:45:00',
      weeklyMileage: 'mid',
      selectedIntervalDist: 400,
    };

    const result = calculateTempoPlan(input);

    // Race Pace: 105 mins / 21.0975 = 4.976 mins/km = 298.6 s/km (~4:59/km)
    // Tempo Pace: 298.6 - 5s = 293.6 s/km
    // 293.6s = 4m 53.6s -> 4:54 /km
    expect(result.targetPace).toBe('4:54 /km');
    
    // Mid Mileage -> 35 mins
    expect(result.durationMinutes).toBe(35);
  });
});
