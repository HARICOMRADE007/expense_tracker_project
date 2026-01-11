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
import { exportToExcel, exportRangeToExcel } from '../utils/exportUtils';
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

    // Range Export State
    const [showExportModal, setShowExportModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleRangeExport = () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }
        // Import strictly here if needed, or assume it's imported at top
        // For now, I'll update imports in a separate check or assume auto-import if IDE handles it
        // but for safety, I will rely on updating imports in the next step or same step if I can view top
        // Actually, let's just rely on the existing import update I'll do next.
        // Wait, I can only do one replacement per tool call usually unless I assume the import is there.
        // I will add the logic first.
        import('../utils/exportUtils').then(module => {
            module.exportRangeToExcel(expenses, startDate, endDate);
            setShowExportModal(false);
        });
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
            {/* Theme Toggle - Left Aligned */}
            <div className="absolute top-4 left-4 z-50 flex gap-3 items-center">
                <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

                <button
                    onClick={() => setShowExportModal(true)}
                    className={`p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 ${isDark
                            ? 'bg-gray-800/90 text-green-400 hover:bg-gray-700 border-gray-700'
                            : 'bg-white/90 text-green-600 hover:bg-white border-white/20'
                        } backdrop-blur-xl border`}
                    title="Download Report"
                >
                    <FileSpreadsheet size={20} />
                    <span className="hidden sm:inline font-medium text-sm">Report</span>
                </button>
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} transform transition-all`}>
                        <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Download Expense Report</h3>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>From Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className={`w-full p-2 rounded-lg border outline-none ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                                        }`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>To Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className={`w-full p-2 rounded-lg border outline-none ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={() => setShowExportModal(false)}
                                className={`px-4 py-2 rounded-lg font-medium ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRangeExport}
                                className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 shadow-lg shadow-green-500/20"
                            >
                                Download Excel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute top-4 right-4 flex gap-4 items-center z-50">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${isOnline
                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="hidden sm:inline">{isOnline ? 'System Online' : 'Offline Mode'}</span>
                </div>

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
