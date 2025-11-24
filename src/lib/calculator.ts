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
  splits: { km: number; pace: string; cumulativeTime: string; phase: string }[];
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
  mode: TargetMode,
  isBonkMode: boolean = false
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
    
    // Compensate: 
    // Normal Mode: BasePace = AvgPace / 1.01 (Aggressive)
    // Bonk Mode: BasePace = AvgPace / 1.00 (No compensation needed for survival)
    const compensateFactor = isBonkMode ? 1.00 : 1.01;
    basePaceSeconds = avgPaceSeconds / compensateFactor;
  }

  // Step 2: Calculate 3 Phases
  // Define multipliers based on mode
  const multipliers = isBonkMode 
    ? { warm: 1.05, cruise: 1.00, kick: 1.05 } // Safe: Slower start, steady cruise, relaxed finish
    : { warm: 1.125, cruise: 1.00, kick: 0.925 }; // Normal: Slow start, steady cruise, fast finish

  const warmupPaceSeconds = basePaceSeconds * multipliers.warm;
  const cruisePaceSeconds = basePaceSeconds * multipliers.cruise;
  const kickPaceSeconds = basePaceSeconds * multipliers.kick;

  const warmupDist = distance * 0.2;
  const cruiseDist = distance * 0.6; // 80% - 20%
  const kickDist = distance * 0.2; // 100% - 80%

  // Create Phase Data
  const phases = {
    warmup: {
      name: isBonkMode ? "ช่วงที่ 1: วอร์มเบาๆ" : "ช่วงที่ 1: เริ่มให้ช้า",
      range: `0 - ${warmupDist} km`,
      distance: warmupDist,
      pace: formatSecondsToPace(warmupPaceSeconds),
      paceSeconds: warmupPaceSeconds,
      description: isBonkMode 
        ? `ช่วงเริ่มต้น ${warmupDist} กิโลเมตรแรก วิ่งสบายๆ ไม่ต้องกดดันตัวเอง รักษาแรงไว้ให้มากที่สุด ถ้าใครแซงก็ปล่อยเขาไป เราเน้นจบสวยๆ ครับ`
        : `เริ่มต้น ${warmupDist} กิโลเมตรแรก อย่าเพิ่งรีบครับ! ให้คุณวิ่งด้วยความเร็ว Pace ${formatSecondsToPace(warmupPaceSeconds)} เท่านั้น ช่วงนี้สำคัญมากที่ต้อง 'ดึง' ตัวเองให้ช้ากว่าความรู้สึก เพื่อวอร์มเครื่องและเก็บพลังงานไว้ใช้ตอนท้าย จำไว้ว่าถ้าคุณรู้สึกว่าวิ่งช้าไป แปลว่าคุณมาถูกทางแล้วครับ`,
    },
    cruise: {
      name: isBonkMode ? "ช่วงที่ 2: ประคองตัว" : "ช่วงที่ 2: รักษาเพซแข่ง",
      range: `${warmupDist} - ${warmupDist + cruiseDist} km`,
      distance: cruiseDist,
      pace: formatSecondsToPace(cruisePaceSeconds),
      paceSeconds: cruisePaceSeconds,
      description: isBonkMode
        ? `เข้าสู่ระยะ ${warmupDist} - ${warmupDist + cruiseDist} กม. ให้รักษาระดับความเร็วนี้ไว้เรื่อยๆ หายใจลึกๆ ผ่อนคลายไหล่และแขน ไม่ต้องเร่ง แค่ประคองไปเรื่อยๆ ครับ`
        : `เมื่อเข้าสู่กิโลเมตรที่ ${warmupDist} ให้ขยับความเร็วขึ้นมาล็อกไว้ที่ Pace ${formatSecondsToPace(cruisePaceSeconds)} นี่คือ Race Pace จริงของคุณ รักษารอบขาและการหายใจให้นิ่งที่สุด เหมือนหุ่นยนต์ ช่วงนี้ยาวนานที่สุด ให้โฟกัสที่ฟอร์มการวิ่งครับ`,
    },
    kick: {
      name: isBonkMode ? "ช่วงที่ 3: จบแบบไม่เจ็บ" : "ช่วงที่ 3: ใส่ยับถ้าคุณยังเหลือ",
      range: `${warmupDist + cruiseDist} - ${distance} km`,
      distance: kickDist,
      pace: formatSecondsToPace(kickPaceSeconds),
      paceSeconds: kickPaceSeconds,
      description: isBonkMode
        ? `ช่วงสุดท้ายแล้ว! ไม่ต้องเร่งแซงใคร เน้นวิ่งให้จบแบบไม่เจ็บ Pace อาจจะตกลงบ้างก็ไม่เป็นไร ขอแค่ก้าวต่อไปจนถึงเส้นชัย คุณทำได้!`
        : `ช่วง ${kickDist} กิโลเมตรสุดท้าย ถ้าแรงยังเหลือ นี่คือเวลาของคุณ! ให้ค่อยๆ เร่งความเร็วขึ้นไปที่ Pace ${formatSecondsToPace(kickPaceSeconds)} เทคนิคคือ 'มองหาคนข้างหน้า' ล็อกเป้าหมาย แล้วค่อยๆ วิ่งดูดเข้าไปหา แซงแล้วมองหาคนถัดไป ใช้แรงก๊อกสุดท้ายใส่ให้หมดจนเข้าเส้นชัย!`,
    },
  };

  // Step 3: Generate Splits and Total Time
  const splits: { km: number; pace: string; cumulativeTime: string; phase: string }[] = [];
  let currentSeconds = 0;

  for (let i = 1; i <= distance; i++) {
    let paceSeconds = 0;
    let phaseName = "";
    if (i <= warmupDist) {
      paceSeconds = warmupPaceSeconds;
      phaseName = "Warm Up";
    } else if (i <= warmupDist + cruiseDist) {
      paceSeconds = cruisePaceSeconds;
      phaseName = "Cruise";
    } else {
      paceSeconds = kickPaceSeconds;
      phaseName = "Kick";
    }

    currentSeconds += paceSeconds;
    splits.push({
      km: i,
      pace: formatSecondsToPace(paceSeconds),
      cumulativeTime: formatSecondsToTime(currentSeconds),
      phase: phaseName,
    });
  }

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
