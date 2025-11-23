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
      name: "ช่วงที่ 1: เริ่มให้ช้า",
      range: `0 - ${warmupDist} km`,
      distance: warmupDist,
      pace: formatSecondsToPace(warmupPaceSeconds),
      paceSeconds: warmupPaceSeconds,
      description: `เริ่มต้น ${warmupDist} กิโลเมตรแรก อย่าเพิ่งรีบครับ! ให้คุณวิ่งด้วยความเร็ว Pace ${formatSecondsToPace(warmupPaceSeconds)} เท่านั้น ช่วงนี้สำคัญมากที่ต้อง 'ดึง' ตัวเองให้ช้ากว่าความรู้สึก เพื่อวอร์มเครื่องและเก็บพลังงานไว้ใช้ตอนท้าย จำไว้ว่าถ้าคุณรู้สึกว่าวิ่งช้าไป แปลว่าคุณมาถูกทางแล้วครับ`,
    },
    cruise: {
      name: "ช่วงที่ 2: รักษาเพซแข่ง",
      range: `${warmupDist} - ${warmupDist + cruiseDist} km`,
      distance: cruiseDist,
      pace: formatSecondsToPace(cruisePaceSeconds),
      paceSeconds: cruisePaceSeconds,
      description: `เมื่อเข้าสู่กิโลเมตรที่ ${warmupDist} ให้ขยับความเร็วขึ้นมาล็อกไว้ที่ Pace ${formatSecondsToPace(cruisePaceSeconds)} นี่คือ Race Pace จริงของคุณ รักษารอบขาและการหายใจให้นิ่งที่สุด เหมือนหุ่นยนต์ ช่วงนี้ยาวนานที่สุด ให้โฟกัสที่ฟอร์มการวิ่งครับ`,
    },
    kick: {
      name: "ช่วงที่ 3: ใส่ยับถ้าคุณยังเหลือ",
      range: `${warmupDist + cruiseDist} - ${distance} km`,
      distance: kickDist,
      pace: formatSecondsToPace(kickPaceSeconds),
      paceSeconds: kickPaceSeconds,
      description: `ช่วง ${kickDist} กิโลเมตรสุดท้าย ถ้าแรงยังเหลือ นี่คือเวลาของคุณ! ให้ค่อยๆ เร่งความเร็วขึ้นไปที่ Pace ${formatSecondsToPace(kickPaceSeconds)} เทคนิคคือ 'มองหาคนข้างหน้า' ล็อกเป้าหมาย แล้วค่อยๆ วิ่งดูดเข้าไปหา แซงแล้วมองหาคนถัดไป ใช้แรงก๊อกสุดท้ายใส่ให้หมดจนเข้าเส้นชัย!`,
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
