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
    const [isOnline, setIsOnline] = useState(true);

    // Check connection status
    useEffect(() => {
        const checkStatus = async () => {
            const online = await expenseService.checkConnection();
            setIsOnline(online);
        };
        checkStatus();
        // Poll every 30 seconds
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, []);

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

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const loadExpenses = async () => {
        try {
            setLoading(true);
            const data = await expenseService.getAll();
            setExpenses(data);
        } catch (error) {
            console.error('Error loading expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const addExpense = async (expense: any) => {
        const newExpense = await expenseService.add(expense);
        if (newExpense) {
            setExpenses(prev => [newExpense, ...prev]);
        }
    };

    const deleteExpense = async (id: string) => {
        const success = await expenseService.delete(id);
        if (success) {
            setExpenses(prev => prev.filter(e => e.id !== id));
        }
    };

    const filteredExpenses = filterExpenses(expenses, filters);
    const totalExpenses = getTotal(filteredExpenses);
    const todayExpenses = getTodayTotal(expenses);

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${isDark
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
                }`}
        >
            <div className="absolute top-4 right-4 flex gap-4 items-center z-50">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${isOnline
                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="hidden sm:inline">{isOnline ? 'System Online' : 'Offline Mode'}</span>
                </div>

                <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 ${isDark
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20'
                        : 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200'
                        } border shadow-lg hover:shadow-red-500/10`}
                    title="Sign Out"
                >
                    <span className="text-sm font-medium hidden sm:inline">Logout</span>
                    <LogOut size={18} />
                </button>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl relative z-10">
                <header className="mb-8 sm:mb-12 text-center">
                    <h1
                        className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-blue-500 via-green-500 to-cyan-500 bg-clip-text text-transparent animate-gradient`}
                    >
                        SpendWise
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Welcome, <span className="font-semibold text-blue-500">{session.user.user_metadata?.full_name || session.user.email?.split('@')[0]}</span>
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

            {/* Floating Advisor */}
            <FinancialAdvisor expenses={expenses} isDark={isDark} />
        </div>
    );
};

export default Dashboard;
