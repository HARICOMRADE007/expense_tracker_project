import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import type { Expense, ExpenseFilters, ExpenseCategory } from './types/expense';
import ExpenseForm from './components/ExpenseForm';
import DashboardStats from './components/DashboardStats';
import TransactionList from './components/TransactionList';
import Filters from './components/Filters';
import ThemeToggle from './components/ThemeToggle';
import { CategoryPieChart, CategoryBarChart, TrendLineChart } from './components/Charts';
import { filterExpenses, getTotal, getTodayTotal } from './utils/helpers';

const STORAGE_KEY = 'expense-tracker-data';
const THEME_KEY = 'expense-tracker-theme';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const savedExpenses = localStorage.getItem(STORAGE_KEY);
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (e) {
        console.error('Failed to parse expenses from localStorage', e);
      }
    }

    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const addExpense = (expenseData: {
    amount: number;
    category: ExpenseCategory;
    date: string;
    note?: string;
  }) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const filteredExpenses = filterExpenses(expenses, filters);
  const totalExpenses = getTotal(filteredExpenses);
  const todayExpenses = getTodayTotal(filteredExpenses);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || session.user.role !== 'authenticated') {
    return <Login isDark={isDark} />;
  }

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
            Expense Tracker
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
}

export default App;
