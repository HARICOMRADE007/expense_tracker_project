import * as XLSX from 'xlsx';
import { Expense } from '../types/expense';

export const exportToExcel = (expenses: Expense[], month: number, year: number) => {
    // Filter expenses for the specific month/year
    const filtered = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === month && d.getFullYear() === year;
    });

    if (filtered.length === 0) {
        alert('No expenses found for this month');
        return;
    }

    // Format data for Excel
    const data = filtered.map(e => ({
        Date: e.date,
        Category: e.category,
        Amount: e.amount,
        Note: e.note || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");

    // Generate filename: expenses_2024_03.xlsx
    // month is 0-indexed, so add 1
    const monthStr = (month + 1).toString().padStart(2, '0');
    const fileName = `expenses_${year}_${monthStr}.xlsx`;

    XLSX.writeFile(wb, fileName);
};

export const exportRangeToExcel = (expenses: Expense[], startDate: string, endDate: string) => {
    // Filter expenses for the date range (inclusive)
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set end date to end of day to include all expenses on that day
    end.setHours(23, 59, 59, 999);

    const filtered = expenses.filter(e => {
        const d = new Date(e.date);
        return d >= start && d <= end;
    });

    if (filtered.length === 0) {
        alert('No expenses found for this period');
        return;
    }

    // Format data for Excel
    const data = filtered.map(e => ({
        Date: e.date,
        Category: e.category,
        Amount: e.amount,
        Note: e.note || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");

    const fileName = `expenses_${startDate}_to_${endDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
};
