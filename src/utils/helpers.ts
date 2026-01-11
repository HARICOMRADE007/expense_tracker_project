import type { Expense, ExpenseFilters } from '../types/expense';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const filterExpenses = (
  expenses: Expense[],
  filters: ExpenseFilters
): Expense[] => {
  return expenses.filter((expense) => {
    if (filters.category && expense.category !== filters.category) {
      return false;
    }
    if (filters.startDate && expense.date < filters.startDate) {
      return false;
    }
    if (filters.endDate && expense.date > filters.endDate) {
      return false;
    }
    return true;
  });
};

export const isToday = (dateString: string): boolean => {
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const getCategoryTotal = (
  expenses: Expense[],
  category: string
): number => {
  return expenses
    .filter((e) => e.category === category)
    .reduce((sum, e) => sum + e.amount, 0);
};

export const getTodayTotal = (expenses: Expense[]): number => {
  return expenses
    .filter((e) => isToday(e.date))
    .reduce((sum, e) => sum + e.amount, 0);
};

export const getTotal = (expenses: Expense[]): number => {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
};
