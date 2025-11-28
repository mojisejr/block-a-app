export interface RaceEvent {
  id: string;         // UUID (Unique Identifier)
  title: string;      // Event Name
  date: Date;         // Event Date
  notes?: string;     // Optional notes
  createdAt: number;  // Timestamp
}

export type EventStatus = 'upcoming' | 'today' | 'finished';
