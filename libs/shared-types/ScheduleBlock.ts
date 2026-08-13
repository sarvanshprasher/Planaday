interface ScheduleBlock {
  id: string;
  date: string;        // ISO date, the day this block belongs to
  startHour: number;    // 0-23
  endHour: number;
  title: string;
  category?: 'work' | 'personal' | 'health' | 'other';
  status: 'planned' | 'in_progress' | 'done' | 'skipped';
  createdBy: 'user' | 'agent';
}