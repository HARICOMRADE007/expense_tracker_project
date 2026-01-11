import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { ExpenseCategory } from '../types/expense';
import { CATEGORIES, CATEGORY_ICONS } from '../utils/constants';

interface ExpenseFormProps {
  onAddExpense: (expense: {
    amount: number;
    category: ExpenseCategory;
    date: string;
    note?: string;
  }) => void;
  isDark: boolean;
}

export default function ExpenseForm({ onAddExpense, isDark }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsAdding(true);
    setTimeout(() => {
      onAddExpense({
        amount: parseFloat(amount),
        category,
        date,
        note: note.trim() || undefined,
      });
      setAmount('');
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
      setIsAdding(false);
    }, 300);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${
        isDark
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-white/70 border-white/20'
      } backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all duration-300`}
    >
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
        Add New Expense
      </h2>

      <div className="space-y-5">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            step="0.01"
            required
            className={`w-full px-4 py-3 rounded-xl border ${
              isDark
                ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Category
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all duration-200 ${
                    category === cat
                      ? isDark
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-blue-500 text-white shadow-lg scale-105'
                      : isDark
                      ? 'bg-gray-900/50 text-gray-400 hover:bg-gray-800'
                      : 'bg-white/50 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-xl border ${
              isDark
                ? 'bg-gray-900/50 border-gray-700 text-white'
                : 'bg-white/50 border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Note (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className={`w-full px-4 py-3 rounded-xl border ${
              isDark
                ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
          />
        </div>

        <button
          type="submit"
          disabled={isAdding || !amount || parseFloat(amount) <= 0}
          className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2`}
        >
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Plus size={20} />
              Add Expense
            </>
          )}
        </button>
      </div>
    </form>
  );
}
