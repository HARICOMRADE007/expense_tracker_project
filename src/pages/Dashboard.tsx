import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { LogOut, Download, FileSpreadsheet } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Expense, ExpenseFilters, ExpenseCategory } from '../types/expense';
import ExpenseForm from '../components/ExpenseForm';
import DashboardStats from '../components/DashboardStats';
import TransactionList from '../components/TransactionList';
import Filters from '../components/Filters';
import ThemeToggle from '../components/ThemeToggle';
import { CategoryPieChart, CategoryBarChart, TrendLineChart } from '../components/Charts';
import { filterExpenses, getTotal, getTodayTotal } from '../utils/helpers';
import { exportToExcel } from '../utils/exportUtils';
import { expenseService } from '../services/expenseService';
import FinancialAdvisor from '../components/FinancialAdvisor';

interface DashboardProps {
    // ...
}

const Dashboard = ({ session, isDark, toggleTheme }: DashboardProps) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [filters, setFilters] = useState<ExpenseFilters>({});
    const [loading, setLoading] = useState(true);

    // Export state
    const [exportYear, setExportYear] = useState(new Date().getFullYear());
    const [exportMonth, setExportMonth] = useState(new Date().getMonth());

    // Load initial data from Supabase
    useEffect(() => {
        loadExpenses();
    }, []);

    const handleExport = () => {
        exportToExcel(expenses, exportMonth, exportYear);
    };

    // ... loadExpenses, addExpense, deleteExpense ...

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${isDark
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
                }`}
        >
            <div className="absolute top-4 right-4 flex gap-4">
                {/* Export Controls */}
                <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'
                    }`}>
                    <select
                        value={exportMonth}
                        onChange={(e) => setExportMonth(Number(e.target.value))}
                        className={`bg-transparent outline-none text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>
                                {new Date(0, i).toLocaleString('default', { month: 'short' })}
                            </option>
                        ))}
                    </select>
                    <select
                        value={exportYear}
                        onChange={(e) => setExportYear(Number(e.target.value))}
                        className={`bg-transparent outline-none text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleExport}
                        className="p-1 rounded-full hover:bg-green-500/20 text-green-500 transition-colors"
                        title="Export to Excel"
                    >
                        <FileSpreadsheet size={18} />
                    </button>
                </div>

                <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                <button
                    // ...        setLoading(true);
                    const data= await expenseService.getAll();
                setExpenses(data);
                setLoading(false);
    };

                const addExpense = async (expenseData: {
                    amount: number;
                category: ExpenseCategory;
                date: string;
                note?: string;
    }) => {
        // Optimistic Update: Add to UI immediately
        const optimisticId = crypto.randomUUID();
                const newExpense: Expense = {
                    ...expenseData,
                    id: optimisticId,
                createdAt: Date.now(),
        };

        setExpenses((prev) => [newExpense, ...prev]);

                // Send to Cloud
                const savedExpense = await expenseService.add(newExpense);

                // If successful, update ID (optional, or just refresh in background)
                if (savedExpense) {
                    setExpenses(prev => prev.map(e => e.id === optimisticId ? { ...e, id: savedExpense.id } : e));
        }
    };

    const deleteExpense = async (id: string) => {
                    // Optimistic Update
                    setExpenses((prev) => prev.filter((e) => e.id !== id));

                // Sync to Cloud
                await expenseService.delete(id);
    };

    const handleLogout = async () => {
                    await supabase.auth.signOut();
    };

                const filteredExpenses = filterExpenses(expenses, filters);
                const totalExpenses = getTotal(filteredExpenses);
                const todayExpenses = getTodayTotal(filteredExpenses);

                return (
                <div
                    className={`min-h-screen transition-colors duration-300 ${isDark
                        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
                        }`}
                >
                    <div className="absolute top-4 right-4 flex gap-4">
                        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                        <button
                            onClick={handleLogout}
                            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isDark
                                ? 'bg-gray-800/50 text-gray-400 hover:text-red-400 hover:bg-gray-700/50'
                                : 'bg-white/50 text-gray-600 hover:text-red-500 hover:bg-white/80'
                                } shadow-lg border ${isDark ? 'border-gray-700' : 'border-white/20'
                                }`}
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
                        <header className="mb-8 sm:mb-12 text-center">
                            <h1
                                className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-blue-500 via-green-500 to-cyan-500 bg-clip-text text-transparent animate-gradient`}
                            >
                                SpendWise
                            </h1>
                            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Welcome, {session.user.email}
                            </p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                <ExpenseForm onAddExpense={addExpense} isDark={isDark} />
                            </div>

                            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                                <DashboardStats
                                    total={totalExpenses}
                                    todayTotal={todayExpenses}
                                    expenseCount={filteredExpenses.length}
                                    isDark={isDark}
                                />

                                <Filters filters={filters} onFilterChange={setFilters} isDark={isDark} />

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div
                                        className={`${isDark
                                            ? 'bg-gray-800/50 border-gray-700'
                                            : 'bg-white/70 border-white/20'
                                            } backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border`}
                                    >
                                        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                                            Category Breakdown
                                        </h3>
                                        <CategoryPieChart expenses={filteredExpenses} isDark={isDark} />
                                    </div>

                                    <div
                                        className={`${isDark
                                            ? 'bg-gray-800/50 border-gray-700'
                                            : 'bg-white/70 border-white/20'
                                            } backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border`}
                                    >
                                        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                                            Spending by Category
                                        </h3>
                                        <CategoryBarChart expenses={filteredExpenses} isDark={isDark} />
                                    </div>
                                </div>

                                <div
                                    className={`${isDark
                                        ? 'bg-gray-800/50 border-gray-700'
                                        : 'bg-white/70 border-white/20'
                                        } backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border`}
                                >
                                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                                        7-Day Spending Trend
                                    </h3>
                                    <TrendLineChart expenses={filteredExpenses} isDark={isDark} />
                                </div>

                                <TransactionList
                                    expenses={filteredExpenses}
                                    onDelete={deleteExpense}
                                    isDark={isDark}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                );
};

                export default Dashboard;
