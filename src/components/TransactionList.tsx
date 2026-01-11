import { Trash2 } from 'lucide-react';
import type { Expense } from '../types/expense';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';

interface TransactionListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  isDark: boolean;
}

export default function TransactionList({
  expenses,
  onDelete,
  isDark,
}: TransactionListProps) {
  const sortedExpenses = [...expenses].sort((a, b) => b.createdAt - a.createdAt);

  if (expenses.length === 0) {
    return (
      <div
        className={`${
          isDark
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-white/70 border-white/20'
        } backdrop-blur-xl rounded-3xl p-12 shadow-xl border text-center`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
            <span className="text-4xl">💰</span>
          </div>
          <div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No expenses yet
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Start tracking your expenses by adding your first transaction
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isDark
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-white/70 border-white/20'
      } backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border`}
    >
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
        Recent Transactions
      </h2>

      <div className="space-y-3">
        {sortedExpenses.map((expense) => {
          const Icon = CATEGORY_ICONS[expense.category];
          const color = CATEGORY_COLORS[expense.category];
          const date = new Date(expense.date);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div
              key={expense.id}
              className={`${
                isDark
                  ? 'bg-gray-900/50 hover:bg-gray-900/70'
                  : 'bg-white/50 hover:bg-white/70'
              } rounded-xl p-4 transition-all duration-200 hover:shadow-lg group`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-xl shadow-md"
                  style={{ backgroundColor: color + '20' }}
                >
                  <Icon size={24} style={{ color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {expense.category}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formattedDate}
                      </p>
                      {expense.note && (
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'} truncate`}>
                          {expense.note}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} whitespace-nowrap`}>
                        {formatCurrency(expense.amount)}
                      </p>
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-500 transition-all duration-200"
                        aria-label="Delete expense"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
