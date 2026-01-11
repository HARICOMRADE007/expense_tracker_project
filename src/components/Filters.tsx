import { Filter, X } from 'lucide-react';
import type { ExpenseCategory, ExpenseFilters } from '../types/expense';
import { CATEGORIES } from '../utils/constants';

interface FiltersProps {
  filters: ExpenseFilters;
  onFilterChange: (filters: ExpenseFilters) => void;
  isDark: boolean;
}

export default function Filters({ filters, onFilterChange, isDark }: FiltersProps) {
  const hasActiveFilters = filters.category || filters.startDate || filters.endDate;

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div
      className={`${
        isDark
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-white/70 border-white/20'
      } backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="text-blue-500" size={24} />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            Filters
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-500 text-sm font-medium transition-all duration-200"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                category: e.target.value ? (e.target.value as ExpenseCategory) : undefined,
              })
            }
            className={`w-full px-4 py-3 rounded-xl border ${
              isDark
                ? 'bg-gray-900/50 border-gray-700 text-white'
                : 'bg-white/50 border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                startDate: e.target.value || undefined,
              })
            }
            className={`w-full px-4 py-3 rounded-xl border ${
              isDark
                ? 'bg-gray-900/50 border-gray-700 text-white'
                : 'bg-white/50 border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                endDate: e.target.value || undefined,
              })
            }
            className={`w-full px-4 py-3 rounded-xl border ${
              isDark
                ? 'bg-gray-900/50 border-gray-700 text-white'
                : 'bg-white/50 border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
          />
        </div>
      </div>
    </div>
  );
}
