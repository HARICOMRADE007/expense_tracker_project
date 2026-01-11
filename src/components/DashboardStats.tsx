import { useEffect, useState } from 'react';
import { TrendingUp, Calendar, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface DashboardStatsProps {
  total: number;
  todayTotal: number;
  expenseCount: number;
  isDark: boolean;
}

function AnimatedCounter({ value, isDark }: { value: number; isDark: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {formatCurrency(displayValue)}
    </span>
  );
}

export default function DashboardStats({
  total,
  todayTotal,
  expenseCount,
  isDark,
}: DashboardStatsProps) {
  const stats = [
    {
      label: 'Total Expenses',
      value: total,
      icon: Wallet,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: "Today's Expenses",
      value: todayTotal,
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Total Transactions',
      value: expenseCount,
      icon: TrendingUp,
      gradient: 'from-orange-500 to-yellow-500',
      isCount: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${
              isDark
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-white/70 border-white/20'
            } backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
              >
                <Icon className="text-white" size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </p>
              {stat.isCount ? (
                <p className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              ) : (
                <AnimatedCounter value={stat.value} isDark={isDark} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
