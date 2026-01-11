export type ExpenseCategory =
  | 'Food'
  | 'Travel'
  | 'Shopping'
  | 'Rent'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Others';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  note?: string;
  createdAt: number;
}

export interface ExpenseFilters {
  category?: ExpenseCategory;
  startDate?: string;
  endDate?: string;
}
