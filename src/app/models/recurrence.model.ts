export enum RecurrenceType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number; // každý X deň/týždeň/mesiac...
  endDate?: Date;
  dayOfMonth?: number; // pre mesačné platby
  dayOfWeek?: number; // pre týždenné platby
}
