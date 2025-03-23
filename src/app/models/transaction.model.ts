import { RecurrencePattern } from './recurrence.model';

export interface Transaction {
  id: string;
  amount: number; // kladné pre príjmy, záporné pre výdavky
  date: Date;
  description: string;
  categoryId: string;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  paymentMethod?: string;
  location?: string;
  attachmentUrl?: string;
}
